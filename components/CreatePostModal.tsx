import { SpotifyTrack } from "@/types/spotify"
import { useState } from "react";

interface CreatePostModalProps {
    track: SpotifyTrack;
    onClose: () => void;
    onConfirm: (text: string) => void;
    loading: boolean;
}

export default function CreatePostModal({track, onClose, onConfirm, loading}: CreatePostModalProps) {

    const [postText, setPostText] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(postText);
    };
    
    return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      <div className="bg-background-light w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-main">Criar Post</h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          
          <div className="flex items-center gap-4 bg-background p-3 rounded-xl border border-gray-700/30">
            <img 
              src={track.albumImage} 
              alt={track.title} 
              className="w-16 h-16 rounded-md object-cover shadow-md"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-text-main truncate text-lg">{track.title}</span>
              <span className="text-text-muted truncate">{track.artist}</span>
            </div>
          </div>

          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="O que você está achando dessa música?"
            className="w-full h-24 bg-transparent border border-gray-600/50 rounded-xl p-3 text-text-main placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition-colors"
            maxLength={280}
            autoFocus
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full font-semibold text-text-muted hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-full font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
            >
              {loading ? "Processando..." : "Enviar"}
            </button>
          </div>

        </form>
      </div>
    </div>
    );
}