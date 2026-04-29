export async function connectDatabase() {
  return {
    ok: true,
    driver: "local-json",
  };
}
