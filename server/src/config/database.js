import mongoose from 'mongoose';

const connectionCache = new Map();

/**
 * Get or create a Mongoose connection for a specific tenant
 * Uses Schema-per-Tenant approach where each tenant has its own database
 * 
 * @param {string} tenantId - The tenant identifier (e.g., 'phc_001')
 * @returns {Promise<mongoose.Connection>} - Mongoose connection instance
 */
export async function getTenantDB(tenantId) {
  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  // Return cached connection if exists and ready
  if (connectionCache.has(tenantId)) {
    const cachedConnection = connectionCache.get(tenantId);
    if (cachedConnection.readyState === 1) {
      return cachedConnection;
    }
    // Remove stale connection
    connectionCache.delete(tenantId);
  }

  // Create new connection
  const dbName = tenantId;
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const connectionString = `${mongoUri}/${dbName}?retryWrites=true&w=majority`;

  const connection = mongoose.createConnection(connectionString, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  // Cache the connection
  connectionCache.set(tenantId, connection);

  // Handle connection events
  connection.on('error', (err) => {
    console.error(`[${tenantId}] Database connection error:`, err);
    connectionCache.delete(tenantId);
  });

  connection.on('disconnected', () => {
    console.warn(`[${tenantId}] Database disconnected`);
    connectionCache.delete(tenantId);
  });

  // Wait for connection to be established
  try {
    // Check if already connected
    if (connection.readyState === 1) {
      console.log(`[${tenantId}] Connected to database: ${dbName}`);
      return connection;
    }

    // Wait for connection
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      const cleanup = () => {
        clearTimeout(timeout);
        connection.removeListener('connected', onConnected);
        connection.removeListener('error', onError);
      };

      const onConnected = () => {
        cleanup();
        console.log(`[${tenantId}] Connected to database: ${dbName}`);
        resolve();
      };

      const onError = (err) => {
        cleanup();
        reject(err);
      };

      connection.once('connected', onConnected);
      connection.once('error', onError);
    });
    
    return connection;
  } catch (error) {
    connectionCache.delete(tenantId);
    await connection.close().catch(() => {});
    throw new Error(`Failed to connect to tenant database ${dbName}: ${error.message}`);
  }
}

/**
 * Close all tenant connections
 * Useful for graceful shutdown
 */
export async function closeAllConnections() {
  const closePromises = Array.from(connectionCache.values()).map((conn) => {
    if (conn.readyState !== 0) {
      return conn.close();
    }
  });
  
  await Promise.all(closePromises);
  connectionCache.clear();
  console.log('All tenant connections closed');
}

/**
 * Get connection statistics
 * @returns {Object} Connection cache stats
 */
export function getConnectionStats() {
  return {
    totalConnections: connectionCache.size,
    activeConnections: Array.from(connectionCache.values()).filter(
      (conn) => conn.readyState === 1
    ).length,
    tenants: Array.from(connectionCache.keys()),
  };
}

