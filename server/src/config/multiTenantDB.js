const mongoose = require('mongoose');

// Cache connections: Map<tenantId, Connection>
const connectionMap = new Map();

/**
 * Gets or creates a database connection for a specific tenant.
 * Includes "Self-Healing" logic to remove stale connections.
 */
const getTenantDB = async (tenantId) => {
  const existingConn = connectionMap.get(tenantId);

  // 1. Check if connection exists AND is healthy (readyState 1 = connected)
  if (existingConn) {
    if (existingConn.readyState === 1) {
      return existingConn;
    }
    // If stale (disconnected/disconnecting), remove from cache and reconnect
    console.log(`⚠️ Detected stale connection for ${tenantId}. Reconnecting...`);
    connectionMap.delete(tenantId);
  }

  // 2. Normalize Database Name (Prevent double prefixing)
  // If tenantId is "phc_001", use it. If "001", make it "phc_001"
  const dbName = tenantId.startsWith('phc_') ? tenantId : `phc_${tenantId}`;
  const mongoURI = process.env.MONGO_URI;

  try {
    // 3. Create NEW Connection
    const conn = mongoose.createConnection(mongoURI, {
      dbName: dbName,
      autoIndex: true,
      maxPoolSize: 10, // Limit connections per tenant to save resources
    });

    // 4. Attach Lifecycle Listeners (The "Self-Healing" part)
    conn.on('connected', () => console.log(`✅ Connected to Tenant DB: ${dbName}`));
    
    conn.on('error', (err) => {
      console.error(`❌ Connection Error [${dbName}]:`, err);
      connectionMap.delete(tenantId); // Remove from cache on error
    });

    conn.on('disconnected', () => {
      console.warn(`🔌 Disconnected from [${dbName}]`);
      connectionMap.delete(tenantId); // Remove from cache on disconnect
    });

    // 5. Await the connection properly before returning
    // Note: Mongoose 6+ buffers commands, but waiting ensures Auth is correct
    await conn.asPromise();

    connectionMap.set(tenantId, conn);
    return conn;

  } catch (error) {
    console.error(`❌ Critical Error connecting to ${dbName}:`, error);
    throw error;
  }
};

module.exports = { getTenantDB };