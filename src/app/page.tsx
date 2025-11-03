"use client";

import { useState, useEffect } from "react";
import { usePredictionStore } from "@/stores/predictionStore";
import { PredictionCard } from "@/components/predictions/PredictionCard";

export default function Home() {
  const {
    predictions,
    isLoadingPredictions,
    loadDemoData,
    getFilteredPredictions,
    searchQuery,
    selectedCategory,
    sortBy,
  } = usePredictionStore();

  const [filteredPredictions, setFilteredPredictions] = useState(predictions);

  // Load demo data on component mount
  useEffect(() => {
    loadDemoData();
  }, [loadDemoData]);

  // Update filtered predictions when store state changes
  useEffect(() => {
    const filtered = getFilteredPredictions();
    setFilteredPredictions(filtered);
  }, [predictions, searchQuery, selectedCategory, sortBy, getFilteredPredictions]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 pt-32 sm:pt-18">
        {isLoadingPredictions ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPredictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingPredictions && filteredPredictions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-base sm:text-lg mb-4">
              No predictions found
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
