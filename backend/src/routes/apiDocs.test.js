"use strict";

const express = require("express");
const request = require("supertest");
const apiDocsRoutes = require("./apiDocs");

describe("API documentation routes", () => {
  const app = express().use("/api/docs", apiDocsRoutes);

  it("serves a valid OpenAPI document as JSON", async () => {
    const response = await request(app).get("/api/docs/json").expect(200);

    expect(response.body.openapi).toMatch(/^3\./);
    expect(response.body.info.title).toBe("Stellar MarketPay API");
    expect(response.body.paths).toBeDefined();
  });

  it("renders Swagger UI for local API exploration", async () => {
    const response = await request(app).get("/api/docs/").expect(200);

    expect(response.text).toContain("swagger-ui");
  });
});
