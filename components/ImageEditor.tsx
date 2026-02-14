import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { Loader2, Upload, Sparkles, Download, X, ImagePlus } from 'lucide-react';

export const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null); // Reset generated image on new upload
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setIsLoading(true);
    setError(null);

    try {
      // Extract base64 data and mime type
      // Data URL format: "data:image/jpeg;base64,/9j/4AAQSk..."
      const [meta, data] = selectedImage.split(',');
      const mimeType = meta.split(':')[1].split(';')[0];

      const resultBase64 = await editImageWithGemini(data, mimeType, prompt);

      if (resultBase64) {
        setGeneratedImage(`data:image/png;base64,${resultBase64}`);
      } else {
        setError("Échec de la génération de l'image. Veuillez réessayer.");
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la communication avec l'IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearImages = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl p-6 mx-4 mb-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500"></div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-fuchsia-500" />
          Éditeur Magique
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Utilisez l'IA pour retoucher vos photos. Décrivez simplement le changement !
        </p>
      </div>

      <div className="space-y-6">
        {/* Image Display Area */}
        <div className="relative aspect-[4/3] w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-fuchsia-300">
          {!selectedImage ? (
            <div 
              className="text-center p-6 cursor-pointer w-full h-full flex flex-col items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-fuchsia-50 rounded-full flex items-center justify-center mb-3">
                <ImagePlus className="w-8 h-8 text-fuchsia-400" />
              </div>
              <p className="text-gray-500 font-medium">Appuyez pour ajouter une photo</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG supportés</p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img 
                src={generatedImage || selectedImage} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin mb-2" />
                    <p className="text-white font-medium text-sm animate-pulse">Magie en cours...</p>
                  </div>
                </div>
              )}
               {/* Reset Button */}
              <button 
                onClick={clearImages}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                title="Effacer"
              >
                <X className="w-4 h-4" />
              </button>
              
              {generatedImage && (
                <div className="absolute bottom-3 right-3">
                  <a 
                    href={generatedImage} 
                    download="magic-edit.png"
                    className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Enregistrer
                  </a>
                </div>
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Controls */}
        {selectedImage && !generatedImage && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Que souhaitez-vous modifier ?
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex : Ajoutez un coucher de soleil, mettez des feux d'artifice..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 outline-none resize-none bg-gray-50 text-gray-800 placeholder-gray-400 transition-all text-sm"
                  rows={3}
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95
                ${!prompt.trim() || isLoading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 shadow-fuchsia-500/25'
                }`}
            >
              {isLoading ? (
                <>Traitement...</>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Appliquer la Magie
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};