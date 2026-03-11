import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, ShoppingCart, Loader2, Leaf } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, isLoading } = useCartStore();

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    fetchProductByHandle(handle)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Leaf className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground font-body">Product not found</p>
        <Link to="/" className="text-primary font-sans-clean hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const variants = product.variants?.edges || [];
  const selectedVariant = variants[selectedVariantIdx]?.node;
  const images = product.images?.edges || [];
  const hasMultipleVariants = variants.length > 1 && !(variants.length === 1 && variants[0].node.title === "Default Title");

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: product.title, position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky back button */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-sans-clean text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-secondary rounded-2xl overflow-hidden mb-4">
              {images[selectedImage]?.node ? (
                <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="h-20 w-20 text-primary/20" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${i === selectedImage ? 'border-primary' : 'border-border'}`}
                  >
                    <img src={img.node.url} alt={img.node.altText || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">{product.title}</h1>
            <p className="text-muted-foreground font-body mb-6 leading-relaxed">{product.description}</p>

            {selectedVariant && (
              <p className="text-2xl font-sans-clean font-bold text-foreground mb-6">
                {selectedVariant.price.currencyCode === 'INR' ? '₹' : selectedVariant.price.currencyCode}{' '}
                {parseFloat(selectedVariant.price.amount).toFixed(2)}
              </p>
            )}

            {hasMultipleVariants && (
              <div className="mb-6">
                <p className="text-sm font-sans-clean font-semibold text-foreground mb-2">Variant</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v: any, i: number) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      disabled={!v.node.availableForSale}
                      className={`px-4 py-2 rounded-lg text-sm font-sans-clean border transition-colors ${
                        i === selectedVariantIdx
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-foreground hover:border-primary'
                      } ${!v.node.availableForSale ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {v.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isLoading || !selectedVariant?.availableForSale}
              className="w-full bg-primary hover:bg-herbal-dark text-primary-foreground py-3 rounded-lg font-sans-clean font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
            </button>

            {selectedVariant && !selectedVariant.availableForSale && (
              <p className="text-sm text-destructive font-sans-clean mt-2 text-center">This variant is currently out of stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
