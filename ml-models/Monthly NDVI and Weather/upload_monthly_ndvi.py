import os
import ee
import pandas as pd
from datetime import date, datetime
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase  = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
ESTATE_ID = 1   # Rangala estate — fixed

RANGALA_POLYGON = [
    (7.350666491361699, 80.79816978494215),
    (7.350394432499272, 80.79794057548042),
    (7.350200448983159, 80.79745350963381),
    (7.349755324076443, 80.79728503865510),
    (7.349534287420904, 80.79733061482216),
    (7.349320069813151, 80.79746087252940),
    (7.349301337071236, 80.79785191941865),
    (7.348696631201445, 80.79834481282188),
    (7.348122749129699, 80.79872873372183),
    (7.347903881298127, 80.79882593166347),
    (7.347484298340005, 80.79858639359180),
    (7.347404130172590, 80.79888200802225),
    (7.347346741056072, 80.79921763757160),
    (7.347787286143935, 80.79942825130613),
    (7.348070829129957, 80.79947677439512),
    (7.348250794766974, 80.79993089170826),
    (7.348134653103195, 80.80022882063614),
    (7.347977748067785, 80.80063737539379),
    (7.347945973718199, 80.80106517916755),
    (7.348112488880608, 80.80128968790082),
    (7.348459078123514, 80.80150658731180),
    (7.348640405578784, 80.80177331629753),
    (7.348327881553223, 80.80195933229518),
    (7.348136273441507, 80.80233978408663),
    (7.347953271795977, 80.80244136596977),
    (7.347612579900410, 80.80231557365266),
]

MONTH_NAMES = {
    1:"January", 2:"February", 3:"March",    4:"April",
    5:"May",     6:"June",     7:"July",      8:"August",
    9:"September",10:"October",11:"November",12:"December",
}


def get_target_month():
    today = date.today()
    if today.month == 1:
        return today.year - 1, 12
    return today.year, today.month - 1


def fetch_division_ids():
    print("Fetching division IDs...")
    res = supabase.table("division").select("division_id, division_name").execute()
    div_map = {row["division_id"]: row["division_name"] for row in res.data}
    print(f"  {len(div_map)} divisions: {list(div_map.values())}")
    return div_map


def fetch_ndvi_from_gee(year, month):
    print("Authenticating Google Earth Engine...")
    ee.Authenticate()
    ee.Initialize(project="sdgp-smart-tea-monitor")

    polygon_coords = [[lon, lat] for lat, lon in RANGALA_POLYGON]
    polygon = ee.Geometry.Polygon([polygon_coords])

    start = f"{year}-{month:02d}-01"
    end   = f"{year+1}-01-01" if month == 12 else f"{year}-{month+1:02d}-01"

    print(f"Fetching NDVI: {start} → {end}")

    collection = (
        ee.ImageCollection("MODIS/061/MOD13A2")
        .filterDate(start, end)
        .filterBounds(polygon)
        .select("NDVI")
    )

    count = collection.size().getInfo()
    print(f"  {count} MODIS image(s) found")

    if count == 0:
        print("  ⚠️  No images — skipping")
        return None

    ndvi_values = []
    images = collection.toList(count)

    for i in range(count):
        img  = ee.Image(images.get(i))
        ndvi = img.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=polygon,
            scale=1000,
            maxPixels=1e13,
        ).get("NDVI").getInfo()
        if ndvi is not None:
            scaled = round(ndvi * 0.0001, 4)
            ndvi_values.append(scaled)
            print(f"  Image {i+1}: raw={ndvi}  scaled={scaled}")

    if not ndvi_values:
        print("  ⚠️  All images null")
        return None

    avg = round(sum(ndvi_values) / len(ndvi_values), 4)
    print(f"  Monthly avg NDVI = {avg}")
    return avg


def upload_ndvi(year, month, ndvi_avg, div_map):
    month_str = MONTH_NAMES[month]
    updated = errors = 0

    print(f"\nPatching ndvi_avg={ndvi_avg} → division_ndvi_climate ({month_str} {year})...")

    for division_id, division_name in div_map.items():
        try:
            result = (
                supabase.table("division_ndvi_climate")
                .update({"ndvi_avg": ndvi_avg})
                .eq("estate_id",   ESTATE_ID)
                .eq("division_id", division_id)
                .eq("year",        year)
                .eq("month",       month_str)
                .execute()
            )

            if result.data:
                print(f"  ✓ Updated  division_id={division_id} ({division_name})")
                updated += 1
            else:
                # Row missing — insert full skeleton
                supabase.table("division_ndvi_climate").insert({
                    "estate_id":       ESTATE_ID,
                    "division_id":     division_id,
                    "year":            year,
                    "month":           month_str,
                    "ndvi_avg":        ndvi_avg,
                    "green_leaf":      None,
                    "pluckers":        None,
                    "avg_temperature": None,
                    "avg_rainfall":    None,
                    "avg_humidity":    None,
                }).execute()
                print(f"  ➕ Inserted division_id={division_id} ({division_name})")
                updated += 1

        except Exception as e:
            print(f"  ✗ ERROR division_id={division_id}: {e}")
            errors += 1

    print(f"\n  ✅ {updated} rows updated | {errors} errors")


if __name__ == "__main__":
    print(f"\n{'='*55}")
    print(f"  Monthly NDVI Upload — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*55}\n")

    year, month = get_target_month()
    print(f"Target: {MONTH_NAMES[month]} {year}\n")

    div_map  = fetch_division_ids()
    ndvi_avg = fetch_ndvi_from_gee(year, month)

    if ndvi_avg is not None:
        upload_ndvi(year, month, ndvi_avg, div_map)
        print(f"\n🎉 NDVI for {MONTH_NAMES[month]} {year} saved to Supabase.\n")
    else:
        print(f"\n⚠️  No NDVI data for {MONTH_NAMES[month]} {year}.\n")
