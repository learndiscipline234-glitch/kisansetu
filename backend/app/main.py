from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import prices, lots, quality, fpo, demands, orders, assistant, grievance

app = FastAPI(
    title="KisanSetu - Agri Market Intelligence & Direct Trading API",
    description="Unified API for Smart India Hackathon 2026 (SIH26132) - Strengthening market linkages and price discovery for farmers.",
    version="1.0.0"
)

# Allow CORS for local frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(prices.router)
app.include_router(lots.router)
app.include_router(quality.router)
app.include_router(fpo.router)
app.include_router(demands.router)
app.include_router(orders.router)
app.include_router(assistant.router)
app.include_router(grievance.router)

@app.get("/")
def root():
    return {
        "platform": "KisanSetu (Team Shakti)",
        "problem_statement": "SIH26132 - Strengthening market linkages and price discovery for farmers",
        "status": "ONLINE",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ai_engine": "operational",
        "mandi_sync": "active",
        "escrow_service": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
