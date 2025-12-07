# Data Persistence in Docker

## ✅ Your Data is SAFE!

**Good news:** Your database data will **NOT be lost** when you restart Docker!

## How It Works

Your `docker-compose.yml` uses a **named volume** for PostgreSQL:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

This means all your database data is stored in a Docker volume that persists even when containers are stopped.

## What Happens When You Stop/Restart

### ✅ Data PERSISTS (Safe):
```bash
# Stop containers (data stays)
docker-compose stop

# Restart containers (data still there)
docker-compose start

# Or restart
docker-compose restart

# Down and up (data stays)
docker-compose down
docker-compose up
```

**Result:** All your users, data, and tables remain intact! ✅

### ❌ Data is LOST (Dangerous):
```bash
# Down with volume removal (DELETES ALL DATA!)
docker-compose down -v

# Or
docker-compose down --volumes
```

**Result:** All database data is permanently deleted! ❌

## Commands Summary

| Command | Data Persists? | What Happens |
|---------|---------------|--------------|
| `docker-compose stop` | ✅ Yes | Stops containers, data stays |
| `docker-compose start` | ✅ Yes | Starts containers, data intact |
| `docker-compose restart` | ✅ Yes | Restarts containers, data intact |
| `docker-compose down` | ✅ Yes | Stops and removes containers, **volumes stay** |
| `docker-compose up` | ✅ Yes | Starts containers, uses existing data |
| `docker-compose down -v` | ❌ **NO** | **DELETES volumes = ALL DATA LOST** |
| `docker-compose down --volumes` | ❌ **NO** | **DELETES volumes = ALL DATA LOST** |

## Where is Data Stored?

Your PostgreSQL data is stored in a Docker volume named `postgres_data`.

### View Volume:
```bash
docker volume ls
# Look for: MAIN_IN_HOUSE_APP_postgres_data
```

### Inspect Volume:
```bash
docker volume inspect MAIN_IN_HOUSE_APP_postgres_data
```

### Location on Your Machine:
- **Mac/Windows**: Stored in Docker Desktop's VM
- **Linux**: Usually in `/var/lib/docker/volumes/`

## Backup Your Data

### Create Backup:
```bash
# Backup database
docker exec nourish_postgres pg_dump -U nourish_user nourish_db > backup.sql
```

### Restore from Backup:
```bash
# Restore database
cat backup.sql | docker exec -i nourish_postgres psql -U nourish_user -d nourish_db
```

## Safe Restart Procedure

### Normal Restart (Data Safe):
```bash
cd backend
docker-compose down    # Stops containers, keeps volumes
docker-compose up -d   # Starts fresh, data intact
```

### Complete Reset (Data Lost):
```bash
cd backend
docker-compose down -v  # ⚠️ WARNING: Deletes all data!
docker-compose up --build
```

## Testing Data Persistence

1. **Create a user** through the API
2. **Stop containers**: `docker-compose stop`
3. **Start containers**: `docker-compose start`
4. **Check data**: User should still exist! ✅

## Important Notes

- ✅ **Normal restarts are safe** - your data persists
- ⚠️ **Only `-v` flag deletes data** - be careful!
- 💾 **Volumes survive** container removal
- 🔄 **Rebuilds are safe** - `docker-compose up --build` keeps data

## Quick Reference

**Safe commands (data persists):**
```bash
docker-compose stop
docker-compose start
docker-compose restart
docker-compose down
docker-compose up
docker-compose up --build
```

**Dangerous command (deletes data):**
```bash
docker-compose down -v  # ⚠️ USE WITH CAUTION!
```

