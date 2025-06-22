import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import csv from "csvtojson";

export async function GET() {
    const filePath = path.join(process.cwd(), "src/data", "national_universities_japan.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const json = await csv().fromString(fileContent);
    return NextResponse.json(json);
}