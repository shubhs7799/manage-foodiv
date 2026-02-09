import { FIREBASE_DB_URL, firebaseConfig } from '../config/firebase';

export const firestoreAPI = {
  // Get all documents from a collection
  getCollection: async (collectionName) => {
    const response = await fetch(`${FIREBASE_DB_URL}/${collectionName}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch');
    
    return data.documents?.map(doc => ({
      id: doc.name.split('/').pop(),
      ...parseFirestoreFields(doc.fields)
    })) || [];
  },

  // Get a single document
  getDocument: async (collectionName, docId) => {
    const response = await fetch(`${FIREBASE_DB_URL}/${collectionName}/${docId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    
    return {
      id: docId,
      ...parseFirestoreFields(data.fields)
    };
  },

  // Create a document
  createDocument: async (collectionName, docData, docId = null) => {
    const url = docId 
      ? `${FIREBASE_DB_URL}/${collectionName}?documentId=${docId}`
      : `${FIREBASE_DB_URL}/${collectionName}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestoreFields(docData) })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    
    return {
      id: data.name.split('/').pop(),
      ...parseFirestoreFields(data.fields)
    };
  },

  // Update a document
  updateDocument: async (collectionName, docId, docData) => {
    const response = await fetch(`${FIREBASE_DB_URL}/${collectionName}/${docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestoreFields(docData) })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    
    return {
      id: docId,
      ...parseFirestoreFields(data.fields)
    };
  },

  // Delete a document
  deleteDocument: async (collectionName, docId) => {
    const response = await fetch(`${FIREBASE_DB_URL}/${collectionName}/${docId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error.message);
    }
    return true;
  },

  // Query documents with filters
  queryCollection: async (collectionName, filters = []) => {
    const structuredQuery = {
      structuredQuery: {
        from: [{ collectionId: collectionName }],
        where: filters.length > 0 ? buildWhereClause(filters) : undefined
      }
    };

    const response = await fetch(`${FIREBASE_DB_URL}:runQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(structuredQuery)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Query failed');
    
    return data
      .filter(item => item.document)
      .map(item => ({
        id: item.document.name.split('/').pop(),
        ...parseFirestoreFields(item.document.fields)
      }));
  }
};

// Helper functions
function parseFirestoreFields(fields) {
  const result = {};
  for (const [key, value] of Object.entries(fields)) {
    const type = Object.keys(value)[0];
    if (type === 'arrayValue') {
      result[key] = value[type].values?.map(v => {
        const vType = Object.keys(v)[0];
        return v[vType];
      }) || [];
    } else {
      result[key] = value[type];
    }
  }
  return result;
}

function toFirestoreFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = getFirestoreValue(value);
  }
  return fields;
}

function getFirestoreValue(value) {
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: value } : { doubleValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(getFirestoreValue) } };
  if (value === null) return { nullValue: null };
  if (typeof value === 'object') return { mapValue: { fields: toFirestoreFields(value) } };
  return { stringValue: String(value) };
}

function buildWhereClause(filters) {
  if (filters.length === 1) {
    return { fieldFilter: filters[0] };
  }
  return {
    compositeFilter: {
      op: 'AND',
      filters: filters.map(f => ({ fieldFilter: f }))
    }
  };
}
