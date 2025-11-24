import { api } from "./testServer";
import { sequelize } from "../config/database";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /auth/register", () => {
  it("should register a new user", async () => {
    const res = await api.post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "12345678"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail on invalid email", async () => {
    const res = await api.post("/auth/register").send({
      email: "invalid_email",
      password: "12345678"
    });

    expect(res.status).toBe(400);
  });

  it("should fail on wrong parameters", async () => {
    const res = await api.post("/auth/register").send({
      username: "Test User",
      passwd: "123",
      name: "Test User",
      email: "test@example.com",
      password: "12345678"
    }); 

    expect(res.status).toBe(400);
  });
});
