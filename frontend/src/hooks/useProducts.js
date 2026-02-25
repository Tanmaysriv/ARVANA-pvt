import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
// Fallback to local data if API is unreachable
import { products as localProducts, categories as localCategories } from '../data/products'

/**
 * Hook to fetch products from the backend API.
 * Falls back to local data when the API is unavailable.
 *
 * @param {object} params  – optional query params ({ category, sort, search, minPrice, maxPrice })
 * @returns {{ products, loading, error, refetch }}
 */
export function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Stable key so effect re-runs when params change
  const paramKey = JSON.stringify(params)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getProducts(params)
      setProducts(res.data || [])
    } catch (err) {
      console.warn('API unreachable, using local data:', err.message)
      // Fallback: filter local data based on params
      let data = [...localProducts]
      if (params.category && params.category !== 'all') {
        data = data.filter(p => p.category === params.category)
      }
      if (params.search) {
        const q = params.search.toLowerCase()
        data = data.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        )
      }
      setProducts(data)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

/**
 * Hook to fetch a single product by ID.
 *
 * @param {number|string} id
 * @returns {{ product, loading, error }}
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.getProduct(id)
        if (!cancelled) setProduct(res.data || null)
      } catch (err) {
        console.warn('API unreachable, using local data:', err.message)
        // Fallback
        const found = localProducts.find(p => p.id === Number(id))
        if (!cancelled) {
          setProduct(found || null)
          setError(err.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProduct()
    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}

/**
 * Hook to fetch categories.
 *
 * @returns {{ categories, loading, error }}
 */
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await api.getCategories()
        if (!cancelled) setCategories(res.data || [])
      } catch (err) {
        console.warn('API unreachable, using local categories:', err.message)
        if (!cancelled) {
          setCategories(localCategories)
          setError(err.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchCategories()
    return () => { cancelled = true }
  }, [])

  return { categories, loading, error }
}
