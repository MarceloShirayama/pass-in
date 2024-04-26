import { InvalidParamError } from "@shared/error";

export function slugifyText(text: unknown) {
  if (typeof text !== "string") {
    throw new InvalidParamError("text must be a string")
  }
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
