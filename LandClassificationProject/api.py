from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse, HTMLResponse
import uvicorn
import cv2
import numpy as np
import io
from land_classifier import LandColorClassifier

app = FastAPI(
    title="Land Classification API",
    description="API لتصنيف الأراضي حسب الألوان (زراعية – يابسة – طرق – مباني)",
    version="1.0"
)

classifier = LandColorClassifier()

@app.get("/", response_class=HTMLResponse)
def home():
    html_content = """
    <html>
        <head>
            <title>Land Classification</title>
        </head>
        <body>
            <h2>رفع صورة لتصنيف الأراضي</h2>
            <form action="/classify-image-display" enctype="multipart/form-data" method="post">
                <input name="file" type="file" accept="image/*">
                <input type="submit" value="رفع وتحليل">
            </form>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.post("/classify-image-display")
async def classify_image_display(file: UploadFile = File(...)):
    image_data = await file.read()
    np_img = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    # الحصول على المستطيلات لكل نوع
    rectangles = classifier.get_rectangles_from_array(img)

    # رسم المستطيلات على الصورة الأصلية
    colors = {
        'agricultural': (0, 255, 0),
        'arid': (0, 255, 255),
        'roads': (128, 128, 128),
        'buildings': (0, 0, 255)
    }
    labels = {
        'agricultural': 'زراعية',
        'arid': 'يابسة',
        'roads': 'طرق',
        'buildings': 'مباني'
    }
    for land_type, rects in rectangles.items():
        for (x, y, w, h) in rects:
            cv2.rectangle(img, (x, y), (x + w, y + h), colors[land_type], 2)
            cv2.putText(img, labels[land_type], (x, y - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, colors[land_type], 2)

    # تحويل الصورة إلى PNG للعرض في المتصفح
    _, buffer = cv2.imencode(".png", img)
    return StreamingResponse(io.BytesIO(buffer.tobytes()), media_type="image/png")


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
