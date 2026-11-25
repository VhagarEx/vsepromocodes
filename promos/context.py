from .models import Store


def catalog_stores(request):
    return {
        "site_stores": {
            store.slug: {
                "name": store.name,
                "couponsName": store.coupons_name,
                "logo": store.logo,
            }
            for store in Store.objects.all()
        }
    }
