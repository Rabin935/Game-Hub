$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $root "public\games\snake"

if (-not (Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$tileSize = 8
$canvasSize = 128
$gridSize = 16

function New-Canvas {
  $bitmap = [System.Drawing.Bitmap]::new($canvasSize, $canvasSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

  return @{
    Bitmap = $bitmap
    Graphics = $graphics
  }
}

function Get-Brush([string] $hex) {
  return [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Fill-Cells($graphics, $brush, [int[]] $cells) {
  for ($index = 0; $index -lt $cells.Length; $index += 2) {
    $x = $cells[$index]
    $y = $cells[$index + 1]
    $graphics.FillRectangle($brush, $x * $tileSize, $y * $tileSize, $tileSize, $tileSize)
  }
}

function Fill-Rect($graphics, $brush, [int] $x, [int] $y, [int] $width, [int] $height) {
  $graphics.FillRectangle(
    $brush,
    $x * $tileSize,
    $y * $tileSize,
    $width * $tileSize,
    $height * $tileSize
  )
}

function Save-Canvas($canvas, [string] $fileName) {
  $path = Join-Path $outputDir $fileName
  $canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Dispose()
}

function New-SnakeHead {
  $canvas = New-Canvas
  $graphics = $canvas.Graphics

  $outline = Get-Brush "#0f5132"
  $primary = Get-Brush "#1f7a47"
  $highlight = Get-Brush "#2fbf71"
  $eye = Get-Brush "#f8fafc"
  $pupil = Get-Brush "#0b1120"
  $shine = Get-Brush "#7cf3ad"

  Fill-Rect $graphics $outline 6 1 4 1
  Fill-Rect $graphics $outline 5 2 6 1
  Fill-Rect $graphics $outline 4 3 8 1
  Fill-Rect $graphics $outline 3 4 10 1
  Fill-Rect $graphics $outline 2 5 12 6
  Fill-Rect $graphics $outline 3 11 10 1
  Fill-Rect $graphics $outline 4 12 8 1
  Fill-Rect $graphics $outline 5 13 6 1
  Fill-Rect $graphics $outline 6 14 4 1

  Fill-Rect $graphics $primary 6 2 4 1
  Fill-Rect $graphics $primary 5 3 6 1
  Fill-Rect $graphics $primary 4 4 8 1
  Fill-Rect $graphics $primary 3 5 10 6
  Fill-Rect $graphics $primary 4 11 8 1
  Fill-Rect $graphics $primary 5 12 6 1
  Fill-Rect $graphics $primary 6 13 4 1

  Fill-Rect $graphics $highlight 6 3 2 1
  Fill-Rect $graphics $highlight 5 4 3 1
  Fill-Rect $graphics $highlight 4 5 2 5
  Fill-Rect $graphics $highlight 6 5 1 3
  Fill-Cells $graphics $shine @(7,4, 6,5, 5,6)
  Fill-Cells $graphics $eye @(5,4, 10,4, 5,5, 10,5)
  Fill-Cells $graphics $pupil @(5,5, 10,5)

  Save-Canvas $canvas "snake-head.png"

  $outline.Dispose()
  $primary.Dispose()
  $highlight.Dispose()
  $eye.Dispose()
  $pupil.Dispose()
  $shine.Dispose()
}

function New-SnakeBody {
  $canvas = New-Canvas
  $graphics = $canvas.Graphics

  $outline = Get-Brush "#15803d"
  $primary = Get-Brush "#4ade80"
  $stripe = Get-Brush "#86efac"
  $shadow = Get-Brush "#22c55e"

  Fill-Rect $graphics $outline 2 1 12 1
  Fill-Rect $graphics $outline 1 2 14 1
  Fill-Rect $graphics $outline 1 3 14 10
  Fill-Rect $graphics $outline 2 13 12 1
  Fill-Rect $graphics $outline 3 14 10 1

  Fill-Rect $graphics $primary 3 2 10 1
  Fill-Rect $graphics $primary 2 3 12 10
  Fill-Rect $graphics $primary 3 13 10 1

  Fill-Rect $graphics $stripe 4 3 2 10
  Fill-Rect $graphics $stripe 7 3 2 10
  Fill-Rect $graphics $shadow 10 3 2 10
  Fill-Cells $graphics $stripe @(12,4, 12,6, 12,8, 12,10)

  Save-Canvas $canvas "snake-body.png"

  $outline.Dispose()
  $primary.Dispose()
  $stripe.Dispose()
  $shadow.Dispose()
}

function New-Apple {
  $canvas = New-Canvas
  $graphics = $canvas.Graphics

  $leaf = Get-Brush "#4ade80"
  $stem = Get-Brush "#854d0e"
  $outline = Get-Brush "#9f1239"
  $primary = Get-Brush "#ef4444"
  $highlight = Get-Brush "#fb7185"
  $shine = Get-Brush "#fecdd3"

  Fill-Rect $graphics $leaf 8 1 3 1
  Fill-Rect $graphics $leaf 9 2 2 1
  Fill-Rect $graphics $stem 7 2 1 2
  Fill-Cells $graphics $outline @(
    6,3, 8,3,
    4,4, 5,4, 7,4, 9,4, 10,4,
    3,5, 11,5,
    2,6, 12,6,
    2,7, 12,7,
    2,8, 12,8,
    2,9, 12,9,
    3,10, 11,10,
    4,11, 5,11, 7,11, 9,11, 10,11,
    6,12, 8,12
  )
  Fill-Rect $graphics $primary 5 3 3 1
  Fill-Rect $graphics $primary 4 4 7 1
  Fill-Rect $graphics $primary 3 5 9 6
  Fill-Rect $graphics $primary 4 11 7 1
  Fill-Rect $graphics $primary 5 12 5 1

  Fill-Rect $graphics $highlight 4 4 2 4
  Fill-Cells $graphics $highlight @(6,5, 6,6, 5,8)
  Fill-Cells $graphics $shine @(5,5, 5,6, 4,6)

  Save-Canvas $canvas "apple.png"

  $leaf.Dispose()
  $stem.Dispose()
  $outline.Dispose()
  $primary.Dispose()
  $highlight.Dispose()
  $shine.Dispose()
}

New-SnakeHead
New-SnakeBody
New-Apple
