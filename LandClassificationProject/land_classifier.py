import cv2
import numpy as np

class LandColorClassifier:
    def __init__(self):
        # تعريف نطاقات الألوان للأنواع المختلفة (HSV)
        self.color_ranges = {
            'agricultural': {
                'lower_green': np.array([35, 40, 40]),
                'upper_green': np.array([85, 255, 255]),
                'lower_brown': np.array([10, 30, 30]),
                'upper_brown': np.array([25, 255, 255])
            },
            'arid': {
                'lower': np.array([15, 20, 50]),
                'upper': np.array([35, 150, 200])
            },
            'roads': {
                'lower_gray': np.array([0, 0, 50]),
                'upper_gray': np.array([180, 50, 200]),
                'lower_asphalt': np.array([0, 0, 30]),
                'upper_asphalt': np.array([180, 50, 100])
            },
            'buildings': {
                'lower_concrete': np.array([0, 0, 100]),
                'upper_concrete': np.array([180, 50, 200]),
                'lower_red': np.array([0, 50, 50]),
                'upper_red': np.array([10, 255, 255])
            }
        }

    # --- دوال الكشف عن المناطق ---
    def detect_green_areas(self, image):
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        mask_green = cv2.inRange(hsv, self.color_ranges['agricultural']['lower_green'],
                                 self.color_ranges['agricultural']['upper_green'])
        mask_brown = cv2.inRange(hsv, self.color_ranges['agricultural']['lower_brown'],
                                 self.color_ranges['agricultural']['upper_brown'])
        combined_mask = cv2.bitwise_or(mask_green, mask_brown)
        green_ratio = np.sum(combined_mask > 0) / (image.shape[0] * image.shape[1])
        return green_ratio, combined_mask

    def detect_arid_areas(self, image):
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        mask_arid = cv2.inRange(hsv, self.color_ranges['arid']['lower'], self.color_ranges['arid']['upper'])
        arid_ratio = np.sum(mask_arid > 0) / (image.shape[0] * image.shape[1])
        return arid_ratio, mask_arid

    def detect_roads(self, image):
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        mask_gray = cv2.inRange(hsv, self.color_ranges['roads']['lower_gray'], self.color_ranges['roads']['upper_gray'])
        mask_asphalt = cv2.inRange(hsv, self.color_ranges['roads']['lower_asphalt'], self.color_ranges['roads']['upper_asphalt'])
        combined_mask = cv2.bitwise_or(mask_gray, mask_asphalt)
        roads_ratio = np.sum(combined_mask > 0) / (image.shape[0] * image.shape[1])
        return roads_ratio, combined_mask

    def detect_buildings(self, image):
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        mask_concrete = cv2.inRange(hsv, self.color_ranges['buildings']['lower_concrete'],
                                    self.color_ranges['buildings']['upper_concrete'])
        mask_red = cv2.inRange(hsv, self.color_ranges['buildings']['lower_red'],
                               self.color_ranges['buildings']['upper_red'])
        combined_mask = cv2.bitwise_or(mask_concrete, mask_red)
        buildings_ratio = np.sum(combined_mask > 0) / (image.shape[0] * image.shape[1])
        return buildings_ratio, combined_mask

    def analyze_texture(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        texture_variance = np.var(laplacian)
        return texture_variance

    # --- التعرف على جميع المناطق ورسم مستطيل حول كل قطعة أرض ---
    def get_rectangles_from_array(self, image):
        """
        التعرف على جميع المناطق ورسم مستطيل حول كل قطعة أرض
        """
        rectangles = {}
        _, green_mask = self.detect_green_areas(image)
        _, arid_mask = self.detect_arid_areas(image)
        _, roads_mask = self.detect_roads(image)
        _, buildings_mask = self.detect_buildings(image)

        masks = {
            'agricultural': green_mask,
            'arid': arid_mask,
            'roads': roads_mask,
            'buildings': buildings_mask
        }

        for land_type, mask in masks.items():
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            rects = [cv2.boundingRect(cnt) for cnt in contours if cv2.contourArea(cnt) > 100]
            rectangles[land_type] = rects

        return rectangles

    # --- التصنيف ---
    def classify_land_from_array(self, image):
        green_ratio, _ = self.detect_green_areas(image)
        arid_ratio, _ = self.detect_arid_areas(image)
        roads_ratio, _ = self.detect_roads(image)
        buildings_ratio, _ = self.detect_buildings(image)
        texture = self.analyze_texture(image)
        results = {
            'agricultural': green_ratio,
            'arid': arid_ratio,
            'roads': roads_ratio,
            'buildings': buildings_ratio,
            'texture_variance': texture
        }
        main_class = max(['agricultural', 'arid', 'roads', 'buildings'], key=lambda x: results[x])
        return main_class, results

    # --- خريطة الأرض مع المستطيلات ---
    def create_land_map_with_rectangles_from_array(self, image):
        h, w = image.shape[:2]
        land_map = image.copy()  # نسخ الصورة الأصلية

        rectangles = self.get_rectangles_from_array(image)

        # رسم المستطيلات على الصورة الأصلية
        colors = {
            'agricultural': (0, 255, 0),
            'arid': (0, 255, 255),
            'roads': (128, 128, 128),
            'buildings': (0, 0, 255)
        }

        for land_type, rects in rectangles.items():
            for (x, y, rw, rh) in rects:
                cv2.rectangle(land_map, (x, y), (x + rw, y + rh), colors[land_type], 2)

        return land_map, rectangles
