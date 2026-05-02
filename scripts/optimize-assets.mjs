import { execFileSync, spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(__filename), '..')
const docsDir = path.join(rootDir, 'docs')
const outputDir = path.join(docsDir, 'public', 'optimized')
const mermaidSourceDir = path.join(docsDir, 'assets-sources', 'mermaid')
const manifestPath = path.join(outputDir, 'asset-manifest.json')

const rasterExtensions = new Set(['.png', '.jpg', '.jpeg'])
const gifExtensions = new Set(['.gif'])
const svgExtensions = new Set(['.svg'])
const imageExtensions = new Set([
  ...rasterExtensions,
  ...gifExtensions,
  ...svgExtensions
])
const commandAvailability = new Map()

const options = {
  rasterQuality: 82,
  gifQuality: 78,
  maxWidth: 1600,
  minSavingRatio: 0.98
}
const existingManifest = loadExistingManifest()

function loadExistingManifest() {
  if (!fs.existsSync(manifestPath)) return { assets: {} }

  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  } catch {
    return { assets: {} }
  }
}

function toPosix(value) {
  return value.split(path.sep).join('/')
}

function docsRelative(filePath) {
  return toPosix(path.relative(docsDir, filePath))
}

function publicPathFor(relativePath) {
  return `/optimized/${relativePath}`
}

function fileSize(filePath) {
  return fs.statSync(filePath).size
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function hashFile(filePath) {
  return sha256(fs.readFileSync(filePath))
}

function commandExists(command) {
  if (commandAvailability.has(command)) {
    return commandAvailability.get(command)
  }

  const result = spawnSync('command', ['-v', command], {
    shell: true,
    stdio: 'ignore'
  })
  const exists = result.status === 0
  commandAvailability.set(command, exists)
  return exists
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = docsRelative(fullPath)

    if (entry.isDirectory()) {
      if (
        relativePath === '.vitepress' ||
        relativePath.startsWith('.vitepress/') ||
        relativePath === 'public' ||
        relativePath.startsWith('public/') ||
        relativePath === 'public/optimized' ||
        relativePath.startsWith('public/optimized/')
      ) {
        continue
      }

      walk(fullPath, files)
      continue
    }

    if (!entry.isFile()) continue
    files.push(fullPath)
  }

  return files
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function outputRelativeForImage(sourceRelative, extension = '.webp') {
  return `${sourceRelative.replace(/\.[^.]+$/, '')}${extension}`
}

function optimizeRaster(sourcePath, sourceRelative) {
  const outputRelative = outputRelativeForImage(sourceRelative)
  const outputPath = path.join(outputDir, outputRelative)

  if (!commandExists('cwebp')) {
    return useExistingOutput(
      sourcePath,
      outputPath,
      outputRelative,
      'missing cwebp'
    )
  }

  const tempPath = path.join(
    os.tmpdir(),
    `homrl-${sha256(sourcePath).slice(0, 12)}.webp`
  )

  const args = [
    '-quiet',
    '-q',
    String(options.rasterQuality),
    '-m',
    '6',
    '-metadata',
    'none',
    '-resize',
    String(options.maxWidth),
    '0',
    '-resize_mode',
    'down_only',
    sourcePath,
    '-o',
    tempPath
  ]

  try {
    execFileSync('cwebp', args, { stdio: 'ignore' })
  } catch (error) {
    return useExistingOutput(
      sourcePath,
      outputPath,
      outputRelative,
      `cwebp failed: ${error.message}`
    )
  }

  return keepIfSmaller(sourcePath, tempPath, outputPath, outputRelative)
}

function optimizeGif(sourcePath, sourceRelative) {
  const outputRelative = outputRelativeForImage(sourceRelative)
  const outputPath = path.join(outputDir, outputRelative)

  if (!commandExists('gif2webp')) {
    return useExistingOutput(
      sourcePath,
      outputPath,
      outputRelative,
      'missing gif2webp'
    )
  }

  const tempPath = path.join(
    os.tmpdir(),
    `homrl-${sha256(sourcePath).slice(0, 12)}.webp`
  )

  const args = [
    '-quiet',
    '-mixed',
    '-q',
    String(options.gifQuality),
    '-metadata',
    'none',
    sourcePath,
    '-o',
    tempPath
  ]

  try {
    execFileSync('gif2webp', args, { stdio: 'ignore' })
  } catch (error) {
    return useExistingOutput(
      sourcePath,
      outputPath,
      outputRelative,
      `gif2webp failed: ${error.message}`
    )
  }

  return keepIfSmaller(sourcePath, tempPath, outputPath, outputRelative)
}

function optimizeSvg(sourcePath, sourceRelative) {
  const outputRelative = sourceRelative
  const outputPath = path.join(outputDir, outputRelative)
  const source = fs.readFileSync(sourcePath, 'utf8')
  const optimized = `${source
    .replace(/^<\?xml[\s\S]*?\?>\s*/i, '')
    .replace(/^<!DOCTYPE[\s\S]*?>\s*/i, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .trim()}\n`
  const tempPath = path.join(
    os.tmpdir(),
    `homrl-${sha256(sourcePath).slice(0, 12)}.svg`
  )

  fs.writeFileSync(tempPath, optimized)
  return keepIfSmaller(sourcePath, tempPath, outputPath, outputRelative)
}

function keepIfSmaller(sourcePath, tempPath, outputPath, outputRelative) {
  const sourceBytes = fileSize(sourcePath)

  if (!fs.existsSync(tempPath)) {
    return useExistingOutput(
      sourcePath,
      outputPath,
      outputRelative,
      'optimization command did not produce an output file'
    )
  }

  const optimizedBytes = fileSize(tempPath)

  if (optimizedBytes >= Math.round(sourceBytes * options.minSavingRatio)) {
    fs.rmSync(tempPath, { force: true })
    return useExistingOutput(
      sourcePath,
      outputPath,
      outputRelative,
      'optimized file was not smaller'
    )
  }

  ensureDir(outputPath)
  fs.copyFileSync(tempPath, outputPath)
  fs.rmSync(tempPath, { force: true })

  return {
    status: 'optimized',
    optimized: publicPathFor(outputRelative),
    optimizedPath: docsRelative(outputPath),
    sourceBytes,
    optimizedBytes,
    savingRatio: Number((optimizedBytes / sourceBytes).toFixed(4))
  }
}

function useExistingOutput(sourcePath, outputPath, outputRelative, reason) {
  const sourceBytes = fileSize(sourcePath)

  if (!fs.existsSync(outputPath)) {
    return { status: 'skipped', reason, sourceBytes }
  }

  const sourceRelative = docsRelative(sourcePath)
  const sourceHash = hashFile(sourcePath)
  const previousHash = existingManifest.assets?.[sourceRelative]?.sourceHash
  const optimizedBytes = fileSize(outputPath)

  if (previousHash && previousHash !== sourceHash) {
    return {
      status: 'skipped',
      reason: `${reason}; existing optimized file may be stale`,
      sourceBytes,
      optimizedBytes
    }
  }

  if (optimizedBytes >= Math.round(sourceBytes * options.minSavingRatio)) {
    return {
      status: 'skipped',
      reason,
      sourceBytes,
      optimizedBytes
    }
  }

  return {
    status: 'optimized',
    optimized: publicPathFor(outputRelative),
    optimizedPath: docsRelative(outputPath),
    sourceBytes,
    optimizedBytes,
    savingRatio: Number((optimizedBytes / sourceBytes).toFixed(4)),
    preserved: true,
    reason
  }
}

function collectImages() {
  return walk(docsDir).filter((filePath) =>
    imageExtensions.has(path.extname(filePath).toLowerCase())
  )
}

function collectMarkdownFiles() {
  return walk(docsDir).filter((filePath) => filePath.endsWith('.md'))
}

function extractMermaidBlocks(markdownPath) {
  const source = fs.readFileSync(markdownPath, 'utf8')
  const blocks = []
  const pattern = /^```mermaid[^\n]*\n([\s\S]*?)^```/gm
  let match
  let index = 0

  while ((match = pattern.exec(source)) !== null) {
    index += 1
    const body = match[1].trimEnd() + '\n'
    const pageRelative = docsRelative(markdownPath)
    const pageBase = pageRelative.replace(/\.md$/, '')
    const blockId = `${pageBase.replace(/\/index$/, '').replace(/\//g, '__')}__${String(index).padStart(2, '0')}`
    const sourceRelative = `${pageBase}-${String(index).padStart(2, '0')}.mmd`
    const sourcePath = path.join(mermaidSourceDir, sourceRelative)

    ensureDir(sourcePath)
    fs.writeFileSync(sourcePath, body)

    blocks.push({
      id: blockId,
      page: pageRelative,
      index,
      source: docsRelative(sourcePath),
      hash: sha256(body).slice(0, 16),
      status: 'source-only'
    })
  }

  return blocks
}

function writeAssetsReadme(manifest) {
  const readmePath = path.join(docsDir, 'assets-sources', 'README.md')
  const optimizedCount = Object.values(manifest.assets).filter(
    (asset) => asset.status === 'optimized'
  ).length
  const svgCount = Object.keys(manifest.svgSources).length

  const body = `# Asset Sources

This directory stores editable source-side records for generated course media.

- Original raster and SVG files remain in their chapter folders under \`docs/\`.
- Optimized files for GitHub Pages live under \`docs/public/optimized/\`.
- \`docs/public/optimized/asset-manifest.json\` maps each source file to its optimized derivative.
- Mermaid blocks are extracted to \`docs/assets-sources/mermaid/\` so they can be edited or rendered offline later.

Current manifest summary:

- Optimized image derivatives: ${optimizedCount}
- SVG source records: ${svgCount}
- Mermaid source records: ${manifest.mermaid.length}

Run \`npm run assets:optimize\` after adding or changing course images.
`

  fs.mkdirSync(path.dirname(readmePath), { recursive: true })
  fs.writeFileSync(readmePath, body)
}

function main() {
  fs.mkdirSync(outputDir, { recursive: true })

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    options,
    assets: {},
    svgSources: {},
    mermaid: []
  }

  for (const imagePath of collectImages()) {
    const relativePath = docsRelative(imagePath)
    const extension = path.extname(imagePath).toLowerCase()
    const sourceBytes = fileSize(imagePath)
    const source = `docs/${relativePath}`
    const sourceHash = hashFile(imagePath)

    if (rasterExtensions.has(extension)) {
      manifest.assets[relativePath] = {
        source,
        sourceHash,
        sourceBytes,
        type: extension.slice(1),
        ...optimizeRaster(imagePath, relativePath)
      }
      continue
    }

    if (gifExtensions.has(extension)) {
      manifest.assets[relativePath] = {
        source,
        sourceHash,
        sourceBytes,
        type: 'gif',
        animated: true,
        ...optimizeGif(imagePath, relativePath)
      }
      continue
    }

    if (svgExtensions.has(extension)) {
      const optimizedSvg = optimizeSvg(imagePath, relativePath)

      manifest.assets[relativePath] = {
        source,
        sourceHash,
        sourceBytes,
        type: 'svg',
        ...optimizedSvg
      }
      manifest.svgSources[relativePath] = {
        source,
        sourceHash,
        sourceBytes,
        type: 'svg',
        status: optimizedSvg.status,
        optimized: optimizedSvg.optimized,
        note: 'Editable SVG source is kept in place. The optimized derivative is a minified SVG; add a rasterizer such as sharp, rsvg-convert, or ImageMagick if WebP/PNG derivatives are desired later.'
      }
    }
  }

  for (const markdownPath of collectMarkdownFiles()) {
    manifest.mermaid.push(...extractMermaidBlocks(markdownPath))
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  writeAssetsReadme(manifest)

  const optimizedCount = Object.values(manifest.assets).filter(
    (asset) => asset.status === 'optimized'
  ).length
  const skippedCount = Object.values(manifest.assets).length - optimizedCount

  console.log(
    `Optimized ${optimizedCount} images, skipped ${skippedCount}, indexed ${
      Object.keys(manifest.svgSources).length
    } SVGs and ${manifest.mermaid.length} Mermaid blocks.`
  )
}

main()
