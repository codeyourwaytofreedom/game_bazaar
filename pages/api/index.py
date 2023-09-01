from contextlib import asynccontextmanager

from fastapi import FastAPI
from aiohttp_ip_rotator import RotatingClientSession

AWS_ACCESS_KEY_ID = "AKIA57DRPWL4LWJSX5OV"
AWS_SECRET_ACCESS_KEY = "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"


@asynccontextmanager
async def lifespan(app: FastAPI):
    global IP_ROTATOR  # Reference the global IP_ROTATOR variable
    IP_ROTATOR = RotatingClientSession(
        "https://api.steampowered.com",
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
    )
    await IP_ROTATOR.start()

    yield

    await IP_ROTATOR.close()


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def read_root():
    """
    Test example:
    """
    return {"working": True}


@app.get("/inventory/{steam_id}/{api_key}/{app_id}")
async def read_item(
    steam_id: int,
    api_key: str,
    app_id: int,
):
    """
    Inv example:
    """
    global IP_ROTATOR
    print(IP_ROTATOR, type(IP_ROTATOR))
    response = await IP_ROTATOR.get(
        f"https://api.steampowered.com/IEconService/GetInventoryItemsWithDescriptions/v1/?key={api_key}&steamid={steam_id}&appid={app_id}&contextid=2&get_descriptions=true"
    )

    return await response.text()
