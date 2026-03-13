/**
 * Extract HTML content from a container element including all styles
 * This is specifically designed for contract preview components
 */
export async function extractHtmlWithStyles(
  containerRef: HTMLDivElement | null
): Promise<string> {
  if (!containerRef) {
    throw new Error('Container ref is null')
  }

  // Clone the container to avoid modifying the original
  const clone = containerRef.cloneNode(true) as HTMLDivElement

  // Convert ALL logo images to base64 data URL (for multi-page documents)
  const logoImages = clone.querySelectorAll(
    'img[src="/logo-hover.svg"]'
  ) as NodeListOf<HTMLImageElement>

  if (logoImages.length > 0) {
    try {
      // Fetch the logo once and convert to base64
      const response = await fetch('/logo-hover.svg')
      const blob = await response.blob()
      const reader = new FileReader()

      const logoDataUrl = await new Promise<string>(resolve => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })

      // Apply the base64 data URL to ALL logo images
      logoImages.forEach(img => {
        img.src = logoDataUrl
      })
    } catch (error) {
      console.warn('Failed to convert logo to base64:', error)
    }
  }

  // Fetch and convert TH Sarabun New fonts to base64
  const sarabunFontUrls = [
    '/fonts/THSarabunNew.ttf',
    '/fonts/THSarabunNew-Bold.ttf',
    '/fonts/THSarabunNew-Italic.ttf',
    '/fonts/THSarabunNew-BoldItalic.ttf'
  ]

  // Noto Sans Thai from Google Fonts (woff2)
  const notoSansFontUrls = [
    {
      url: 'https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.woff2',
      key: 'noto-sans-thai-400'
    },
    {
      url: 'https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RttjJ-QRvzzXg.woff2',
      key: 'noto-sans-thai-700'
    }
  ]

  const fontBase64Map: Record<string, string> = {}

  // Load TH Sarabun New fonts
  for (const fontUrl of sarabunFontUrls) {
    try {
      const response = await fetch(fontUrl)
      const blob = await response.blob()
      const reader = new FileReader()

      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })

      fontBase64Map[fontUrl] = base64
    } catch (error) {
      console.warn(`Failed to load font ${fontUrl}:`, error)
    }
  }

  // Load Noto Sans Thai fonts
  for (const { url, key } of notoSansFontUrls) {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const reader = new FileReader()

      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })

      fontBase64Map[key] = base64
    } catch (error) {
      console.warn(`Failed to load Noto Sans Thai font:`, error)
    }
  }

  // Get the outer HTML of the cloned container
  let html = clone.outerHTML

  // Strip pdf-page-gap class (used only for UI visual separation)
  html = html.replace(/pdf-page-gap/g, '')

  // Extract all applied styles from the document
  const styles = Array.from(document.styleSheets)
    .flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules)
      } catch (e) {
        // CORS issues with external stylesheets
        return []
      }
    })
    .map(rule => rule.cssText)
    .join('\n')

  // Build complete HTML document with embedded fonts
  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${styles}
    
    /* Embed TH Sarabun New fonts as base64 */
    @font-face {
      font-family: 'TH Sarabun New';
      font-style: normal;
      font-weight: 400;
      src: url('${fontBase64Map['/fonts/THSarabunNew.ttf'] || ''}') format('truetype');
    }
    
    @font-face {
      font-family: 'TH Sarabun New';
      font-style: normal;
      font-weight: 700;
      src: url('${fontBase64Map['/fonts/THSarabunNew-Bold.ttf'] || ''}') format('truetype');
    }
    
    @font-face {
      font-family: 'TH Sarabun New';
      font-style: italic;
      font-weight: 400;
      src: url('${fontBase64Map['/fonts/THSarabunNew-Italic.ttf'] || ''}') format('truetype');
    }
    
    @font-face {
      font-family: 'TH Sarabun New';
      font-style: italic;
      font-weight: 700;
      src: url('${fontBase64Map['/fonts/THSarabunNew-BoldItalic.ttf'] || ''}') format('truetype');
    }
    
    /* Embed Noto Sans Thai as base64 for header */
    @font-face {
      font-family: 'Noto Sans Thai';
      font-style: normal;
      font-weight: 400;
      src: url('${fontBase64Map['noto-sans-thai-400'] || ''}') format('woff2');
    }

    @font-face {
      font-family: 'Noto Sans Thai';
      font-style: normal;
      font-weight: 700;
      src: url('${fontBase64Map['noto-sans-thai-700'] || ''}') format('woff2');
    }
    
    /* PDF-specific styles for paging */
    @page {
      size: A4;
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'TH Sarabun New', sans-serif;
    }

    /* Ensure contract container has white background */
    .bg-white {
      background-color: white !important;
    }

    /* Font classes */
    .font-sans {
      font-family: 'Noto Sans Thai', sans-serif !important;
    }

    .font-sarabun {
      font-family: 'TH Sarabun New', sans-serif !important;
    }

    /* Critical flexbox layout styles for PDF */
    .flex {
      display: flex !important;
    }

    .flex-col {
      flex-direction: column !important;
    }

    .flex-grow {
      flex-grow: 1 !important;
    }

    .flex-shrink-0 {
      flex-shrink: 0 !important;
    }

    .items-start {
      align-items: flex-start !important;
    }

    .items-center {
      align-items: center !important;
    }

    .items-end {
      align-items: flex-end !important;
    }

    .justify-between {
      justify-content: space-between !important;
    }

    .justify-center {
      justify-content: center !important;
    }

    .justify-end {
      justify-content: flex-end !important;
    }

    .gap-2 {
      gap: 0.5rem !important;
    }

    .gap-4 {
      gap: 1rem !important;
    }

    .gap-6 {
      gap: 1.5rem !important;
    }

    .gap-8 {
      gap: 2rem !important;
    }

    .gap-x-8 {
      column-gap: 2rem !important;
    }

    .gap-y-12 {
      row-gap: 3rem !important;
    }

    .text-right {
      text-align: right !important;
    }

    .text-center {
      text-align: center !important;
    }

    .text-left {
      text-align: left !important;
    }

    .grid {
      display: grid !important;
    }

    .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    /* Spacing utilities */
    .mt-auto {
      margin-top: auto !important;
    }

    .mb-2 {
      margin-bottom: 0.5rem !important;
    }

    .mb-4 {
      margin-bottom: 1rem !important;
    }

    .mb-8 {
      margin-bottom: 2rem !important;
    }

    .mt-1 {
      margin-top: 0.25rem !important;
    }

    .mt-4 {
      margin-top: 1rem !important;
    }

    .mt-8 {
      margin-top: 2rem !important;
    }

    .pt-2 {
      padding-top: 0.5rem !important;
    }

    .pt-8 {
      padding-top: 2rem !important;
    }

    .pb-2 {
      padding-bottom: 0.5rem !important;
    }

    .pb-4 {
      padding-bottom: 1rem !important;
    }

    .pb-6 {
      padding-bottom: 1.5rem !important;
    }

    .pb-12 {
      padding-bottom: 3rem !important;
    }

    /* Width utilities */
    .w-auto {
      width: auto !important;
    }

    .w-3\\/4 {
      width: 75% !important;
    }

    .mx-auto {
      margin-left: auto !important;
      margin-right: auto !important;
    }

    /* Height utilities */
    .h-12 {
      height: 3rem !important;
    }

    .h-16 {
      height: 4rem !important;
    }

    /* Border utilities */
    .border-b {
      border-bottom-width: 1px !important;
      border-bottom-style: solid !important;
    }

    .border-b-2 {
      border-bottom-width: 2px !important;
      border-bottom-style: solid !important;
    }

    .border-t {
      border-top-width: 1px !important;
      border-top-style: solid !important;
    }

    .border-gray-100 {
      border-color: rgb(243 244 246) !important;
    }

    .border-gray-200 {
      border-color: rgb(229 231 235) !important;
    }

    .border-gray-400 {
      border-color: rgb(156 163 175) !important;
    }

    .border-dashed {
      border-style: dashed !important;
    }

    /* Position utilities */
    .relative {
      position: relative !important;
    }

    .absolute {
      position: absolute !important;
    }

    .bottom-0 {
      bottom: 0 !important;
    }

    .left-0 {
      left: 0 !important;
    }

    .right-0 {
      right: 0 !important;
    }

    /* Text color utilities */
    .text-indigo-900 {
      color: rgb(49 46 129) !important;
    }

    .text-gray-400 {
      color: rgb(156 163 175) !important;
    }

    .text-gray-500 {
      color: rgb(107 114 128) !important;
    }

    .text-gray-600 {
      color: rgb(75 85 99) !important;
    }

    .text-gray-800 {
      color: rgb(31 41 55) !important;
    }

    /* Font size utilities */
    .text-xs {
      font-size: 0.75rem !important;
      line-height: 1rem !important;
    }

    .text-sm {
      font-size: 0.875rem !important;
      line-height: 1.25rem !important;
    }

    .text-xl {
      font-size: 1.25rem !important;
      line-height: 1.75rem !important;
    }

    /* Font weight utilities */
    .font-bold {
      font-weight: 700 !important;
    }

    .font-semibold {
      font-weight: 600 !important;
    }

    .font-medium {
      font-weight: 500 !important;
    }

    /* Heading colors - ensure visible on white background */
    h1, h2, h3 {
      color: #000000 !important;
    }

    /* Preserve empty paragraphs (line breaks) */
    p:empty {
      min-height: 1em;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `.trim()
}
