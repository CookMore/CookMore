const opentype = require('opentype.js')
const fs = require('fs')
const path = require('path')

// Load the Inter font from our local TTF file using absolute path
opentype.load(
  '/Users/grantedwards/Desktop/CookMore/src/app/api/fonts/inter/ttf/Inter-VariableFont_opsz,wght.ttf',
  (err, font) => {
    if (err) {
      console.error('Error loading font:', err)
      return
    }

    // Convert to Three.js JSON format
    const glyphs = font.glyphs.glyphs
    const threeFont = {
      glyphs: {},
      familyName: font.names.fontFamily.en,
      ascender: font.ascender,
      descender: font.descender,
      underlinePosition: font.tables.post.underlinePosition,
      underlineThickness: font.tables.post.underlineThickness,
      boundingBox: {
        yMin: font.tables.head.yMin,
        xMin: font.tables.head.xMin,
        yMax: font.tables.head.yMax,
        xMax: font.tables.head.xMax,
      },
      resolution: 1000,
      original_font_information: font.tables.name,
    }

    // Convert each glyph
    Object.values(glyphs).forEach((glyph) => {
      if (glyph.unicode !== undefined) {
        const path = glyph.getPath(0, 0, 1000)
        threeFont.glyphs[String.fromCharCode(glyph.unicode)] = {
          ha: glyph.advanceWidth,
          x_min: glyph.xMin,
          x_max: glyph.xMax,
          o: path.commands.map((cmd) => {
            switch (cmd.type) {
              case 'M':
                return ['M', cmd.x, cmd.y]
              case 'L':
                return ['L', cmd.x, cmd.y]
              case 'Q':
                return ['Q', cmd.x1, cmd.y1, cmd.x, cmd.y]
              case 'C':
                return ['C', cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y]
              case 'Z':
                return ['Z']
              default:
                return []
            }
          }),
        }
      }
    })

    // Save the converted font
    const outputPath = path.join(__dirname, '../public/fonts/Inter_Bold.json')
    fs.writeFileSync(outputPath, JSON.stringify(threeFont))
    console.log('Font converted successfully:', outputPath)
  }
)
