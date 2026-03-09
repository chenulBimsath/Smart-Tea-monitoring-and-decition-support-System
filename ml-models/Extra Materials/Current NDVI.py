import ee

# Authenticate and Initialize
ee.Authenticate()
ee.Initialize(project='sdgp-smart-tea-monitor')

# Rangala Plantation Polygon (lat, lon)
rangala_plantation_polygon = [
(7.350666491361699,80.79816978494215),
(7.350394432499272,80.79794057548042),
(7.350200448983159,80.79745350963381),
(7.349755324076443,80.7972850386551),
(7.349534287420904,80.79733061482216),
(7.349320069813151,80.7974608725294),
(7.349301337071236,80.79785191941865),
(7.348696631201445,80.79834481282188),
(7.348122749129699,80.79872873372183),
(7.347903881298127,80.79882593166347),
(7.347484298340005,80.7985863935918),
(7.34740413017259,80.79888200802225),
(7.347346741056072,80.7992176375716),
(7.347787286143935,80.79942825130613),
(7.348070829129957,80.79947677439512),
(7.348250794766974,80.79993089170826),
(7.348134653103195,80.80022882063614),
(7.347977748067785,80.80063737539379),
(7.347945973718199,80.80106517916755),
(7.348112488880608,80.80128968790082),
(7.348459078123514,80.8015065873118),
(7.348640405578784,80.80177331629753),
(7.348327881553223,80.80195933229518),
(7.348136273441507,80.80233978408663),
(7.347953271795977,80.80244136596977),
(7.34761257990041,80.80231557365266)
]

# Convert to (lon, lat)
polygon_coords = [[lon, lat] for lat, lon in rangala_plantation_polygon]

polygon = ee.Geometry.Polygon([polygon_coords])

print("Fetching latest NDVI...")

# MODIS NDVI Collection
collection = ee.ImageCollection('MODIS/061/MOD13A2') \
    .filterBounds(polygon) \
    .sort('system:time_start', False)

# Get latest image
latest_image = ee.Image(collection.first())

# Get date
date = ee.Date(latest_image.get('system:time_start')).format('YYYY-MM-dd').getInfo()

# Calculate NDVI mean
ndvi_value = latest_image.reduceRegion(
    reducer=ee.Reducer.mean(),
    geometry=polygon,
    scale=1000,
    maxPixels=1e13
).get('NDVI').getInfo()

if ndvi_value is not None:
    ndvi_value = ndvi_value * 0.0001
    print(f"\nLatest NDVI Date: {date}")
    print(f"Current NDVI: {round(ndvi_value,4)}")
else:
    print("NDVI data not available for this date.")