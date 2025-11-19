import { useMemo, useState, useEffect } from 'react'
import { LayoutGrid, Rows3, Plus, Edit2, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import products from '../../products.json'
import { ThemeToggle } from './theme-toggle'

type Product = {
  id: number
  name: string
  price: number
  category: string
  stock: number
  description: string
  createdAt?: string
  isActive?: boolean
  tags?: string[]
}

type ProductForm = {
  name: string
  price: string
  category: string
  stock: string
  description: string
}

const PAGE_SIZE = 6

const defaultForm: ProductForm = {
  name: '',
  price: '',
  category: '',
  stock: '',
  description: '',
}

function ProductsPage() {
  const [items, setItems] = useState<Product[]>(products)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearchInput, setDebouncedSearchInput] = useState('')
  const [formState, setFormState] = useState<ProductForm>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<number | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  useEffect(()=>{
    const timer = setTimeout(()=>{
      setDebouncedSearchInput(searchInput.trim().toLocaleLowerCase())
      setCurrentPage(1)
    }, 500)
    return ()=>{
      clearInterval(timer)
    }
  }, [searchInput])


  const filteredProducts = useMemo(() => {
    if (!debouncedSearchInput) {
      return items
    }

    return items.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearchInput)
    )
  }, [items, debouncedSearchInput])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [filteredProducts, currentPage])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleViewToggle = (mode: 'list' | 'grid') => {
    setViewMode(mode)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setFormState({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock ?? 0),
      description: product.description ?? '',
    })
    setErrors({})
    setDialogMode('edit')
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setFormState(defaultForm)
    setErrors({})
    setDialogMode('create')
  }

  const validateForm = () => {
    const validationErrors: Record<string, string> = {}

    if (!formState.name.trim()) {
      validationErrors.name = 'Name is required.'
    }
    if (!formState.price.trim()) {
      validationErrors.price = 'Price is required.'
    } else if (Number.isNaN(Number(formState.price)) || Number(formState.price) < 0) {
      validationErrors.price = 'Price must be a valid number.'
    }
    if (!formState.category.trim()) {
      validationErrors.category = 'Category is required.'
    }
    if (
      formState.stock &&
      (Number.isNaN(Number(formState.stock)) || Number(formState.stock) < 0)
    ) {
      validationErrors.stock = 'Stock must be a positive number.'
    }

    return validationErrors
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nextErrors = validateForm()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload: Product = {
      id: editingId ?? Date.now(),
      name: formState.name.trim(),
      price: Number(formState.price),
      category: formState.category.trim(),
      stock: formState.stock ? Number(formState.stock) : 0,
      description: formState.description.trim(),
      createdAt: editingId
        ? items.find((item) => item.id === editingId)?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
      isActive: true,
      tags: [],
    }

    setItems((prev) => {
      if (editingId) {
        return prev.map((product) => (product.id === editingId ? payload : product))
      }
      return [payload, ...prev]
    })

    setIsDialogOpen(false)
    resetForm()
  }

  const renderTableView = () => (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Added {new Date(product.createdAt ?? '').toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{"₹"+product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(product)}
                  >
                    <Edit2 className="size-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const renderGridView = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {paginatedProducts.map((product) => (
        <Card
          key={product.id}
          className="hover:scale-103 hover:dark:border-white/60 transition-all duration-300 ease-in-out dark:border-white/20"
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between ">
              {product.name}
              <Button
                size="sm"
                variant="outline"
                onClick={() => startEdit(product)}
              >
                <Edit2 className="size-4" />
                Edit
              </Button>
            </CardTitle>
            <CardDescription>{product.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold ">
              {"₹"+product.price}
            </p>
            <p className="text-sm text-muted-foreground">
              Stock • {product.stock} units
            </p>
            {product.description && (
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
      {paginatedProducts.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No products match this search.
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="min-h-screen dark:bg-[#040404]">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              resetForm()
            }
            setIsDialogOpen(open)
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.5em]">
                Catalog
              </p>
              <h1 className="text-3xl font-light">Products</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={() => {
                  resetForm()
                  setDialogMode('create')
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="size-4" />
                New product
              </Button>
            </div>
          </div>

        <div className="flex md:flex-row flex-col-reverse items-center justify-end gap-4 ">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 " />
            <Input
              className="pl-10"
              placeholder="Search products"
              value={searchInput}
              onChange={(e)=>setSearchInput(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewToggle('list')}
            >
              <Rows3 className="size-4" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewToggle('grid')}
            >
              <LayoutGrid className="size-4" />
              Cards
            </Button>
          </div>
        </div>

          <div className="space-y-6">
            {viewMode === 'list' ? renderTableView() : renderGridView()}

            <Pagination className="pt-2 flex flex-wrap">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </PaginationPrevious>
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-medium ">
                {dialogMode === 'edit' ? 'Edit product' : 'Add product'}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === 'edit'
                  ? 'Update the details of this product.'
                  : 'Create a new catalog entry.'}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-5 pt-2" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="Product name"
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name}</p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formState.price}
                    onChange={handleInputChange}
                    placeholder="₹0"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-400">{errors.price}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formState.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="text-xs text-red-400">{errors.stock}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formState.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Electronics"
                />
                {errors.category && (
                  <p className="text-xs text-red-400">{errors.category}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formState.description}
                  onChange={handleInputChange}
                  placeholder="Optional details"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="flex-1">
                  {dialogMode === 'edit' ? 'Update product' : 'Add product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ProductsPage