export function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn("Could not read demo preferences.", error);
    return null;
  }
}

export function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn("Could not save demo preferences; the choice is temporary.", error);
  }
}
