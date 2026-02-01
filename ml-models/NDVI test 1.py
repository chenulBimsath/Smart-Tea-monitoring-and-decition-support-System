import ee
import pandas as pd

ee.Authenticate()

ee.Initialize(project='sdgp-smart-tea-monitor')


LATITUDE = 7.32235810916039
LONGITUDE = 80.77659211055081


# Get NDVI Data
print("Fetching NDVI data from Google Earth Engine...\n")

point = ee.Geometry.Point([LONGITUDE, LATITUDE])

collection = ee.ImageCollection('MODIS/061/MOD13A2') \
    .filterDate('2021-01-01', '2025-12-31') \
    .filterBounds(point) \
    .select('NDVI')

images = collection.toList(collection.size())
count = collection.size().getInfo()

print(f"Found {count} images\n")

results = []

for i in range(count):
    img = ee.Image(images.get(i))
    
    date = ee.Date(img.get('system:time_start')).format('YYYY-MM-dd').getInfo()
    
    ndvi = img.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=point,
        scale=1000
    ).get('NDVI').getInfo()
    
    if ndvi is not None:
        ndvi = ndvi * 0.0001
        
        year = int(date[:4])
        month = int(date[5:7])
        
        results.append({
            'year': year,
            'month': month,
            'date': date,
            'ndvi': round(ndvi, 4)
        })
        
        print(f"{date}: NDVI = {ndvi:.4f}")


# Get Monthly Avr

df = pd.DataFrame(results)

monthly = df.groupby(['year', 'month'])['ndvi'].mean().reset_index()
monthly['ndvi'] = monthly['ndvi'].round(4)

# Save 2 file

monthly.to_csv('rangala_ndvi_monthly.csv', index=False)

print(f"\nSUCCESS! Saved {len(monthly)} months of NDVI data!")
print(f"\nFirst 10 rows:")
print(monthly.head(10))
print(f"\nFile saved as: rangala_ndvi_monthly.csv")