import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('../src/', import.meta.url))

function findVueFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return findVueFiles(path)
    return entry.isFile() && entry.name.endsWith('.vue') ? [path] : []
  })
}

describe('шаблоны Vue', () => {
  it('не используют интерполяцию {{ }} внутри атрибутов', () => {
    for (const file of findVueFiles(sourceRoot)) {
      const content = readFileSync(file, 'utf8')
      const template = content.slice(content.indexOf('<template>'), content.lastIndexOf('</template>') + '</template>'.length)
      const attrs = template.matchAll(/(?:^|\s)(?:[:@\w.-]+)="([^"]*)"/g)
      for (const attribute of attrs) {
        expect(attribute[1], `Ошибочный атрибут в ${file}`).not.toMatch(/\{\{[^}]*\}\}/)
      }
    }
  })
})
