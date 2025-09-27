import formidable, { File as FormidableFile } from "formidable"
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"
import path from "path"

export const config = {
  api: {
    bodyParser: false,
  },
}

function makeSafeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const uploadsDir = path.join(process.cwd(), "uploads")
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

  const form = formidable({ multiples: true, keepExtensions: true })

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: "Error parsing files" })
    }

    const saved: Array<{ originalName: string; savedAs: string; size: number }> = []

    const handleFile = (file: FormidableFile) => {
      const originalName = file.originalFilename || file.newFilename || "unknown"
      const safe = makeSafeFilename(originalName)
      // ensure unique
      const dest = path.join(uploadsDir, `${Date.now()}-${safe}`)
      fs.renameSync(file.filepath, dest)
      saved.push({ originalName, savedAs: dest, size: file.size })
    }

    if (files.files) {
      // files.files can be single or array depending on client
      const f = files.files
      if (Array.isArray(f)) {
        f.forEach((file) => handleFile(file as FormidableFile))
      } else {
        handleFile(f as FormidableFile)
      }
    } else {
      // handle any file fields
      for (const key of Object.keys(files)) {
        const f = (files as any)[key]
        if (Array.isArray(f)) f.forEach((file: FormidableFile) => handleFile(file))
        else handleFile(f as FormidableFile)
      }
    }

    return res.json({ ok: true, fields, saved })
  })
}
