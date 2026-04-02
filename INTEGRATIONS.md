# 🔗 Flux Theme — Integrations Guide

> **Domain:** UI Theme & Branding
> **Prefix:** FT

---

## Integration Map

```
Flux Theme
  ├── Frappe Core
  ├── frappe_visual
```

---

## Frappe Core

### Connection Type
- **Direction:** Bidirectional
- **Protocol:** Python API / REST
- **Authentication:** Frappe session / API key

### Data Flow
| Source | Target | Trigger | Data |
|--------|--------|---------|------|
| Flux Theme | Frappe Core | On submit | Document data |
| Frappe Core | Flux Theme | On change | Updated data |

### Configuration
```python
# In FT Settings or site_config.json
# frappe_core_enabled = 1
```

---

## frappe_visual

### Connection Type
- **Direction:** Bidirectional
- **Protocol:** Python API / REST
- **Authentication:** Frappe session / API key

### Data Flow
| Source | Target | Trigger | Data |
|--------|--------|---------|------|
| Flux Theme | frappe_visual | On submit | Document data |
| frappe_visual | Flux Theme | On change | Updated data |

### Configuration
```python
# In FT Settings or site_config.json
# frappe_visual_enabled = 1
```

---

## API Endpoints

All integration APIs use the standard response format from `flux_theme.api.response`:

```python
from flux_theme.api.response import success, error

@frappe.whitelist()
def sync_data():
    return success(data={}, message="Sync completed")
```

---

*Part of Flux Theme by Arkan Lab*
