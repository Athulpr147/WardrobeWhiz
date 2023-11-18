async function filterAndSortProducts() {
  try {
      const category = 'exampleCategory'; // Replace with your desired category

      // Define the aggregation pipeline for filtering and sorting
      const aggregationPipeline = [
          { $match: { category: category } }, // Filter by category
      ];

      // Sort by price (low to high) and get the result
      const lowToHighProducts = await Product.aggregate([...aggregationPipeline, { $sort: { price: 1 } }]);

      // Sort by price (high to low) and get the result
      const highToLowProducts = await Product.aggregate([...aggregationPipeline, { $sort: { price: -1 } }]);

      // Sort by createdAt (newest first) and get the result
      const newestProducts = await Product.aggregate([...aggregationPipeline, { $sort: { createdAt: -1 } }]);

      // Handle the sorted products
      console.log('Low to High Price:', lowToHighProducts);
      console.log('High to Low Price:', highToLowProducts);
      console.log('Newest Products:', newestProducts);
  } catch (error) {
      // Handle any errors
      console.error(error);
  }
}

// Call the async function to filter and sort products
filterAndSortProducts();
