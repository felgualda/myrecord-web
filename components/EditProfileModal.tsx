import { useState } from "react";
import { UserProfileData } from "@/types/userProfileData";

interface EditProfileModalProps {
    picture: string | null | undefined;
    nickname: string | undefined;
    username: string;
    onConfirm: (data: Partial<UserProfileData>) => void; 
    onClose: () => void;
    isLoading?: boolean; 
}

export default function EditProfileModal({
    picture, 
    nickname, 
    username, 
    onConfirm, 
    onClose,
    isLoading = false
}: EditProfileModalProps) {
    
    const [formData, setFormData] = useState({
        nickname: nickname || "",
        picture: picture || ""
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedData: Partial<UserProfileData> = {};
        
        if (formData.nickname !== nickname) updatedData.nickname = formData.nickname;
        if (formData.picture !== picture) updatedData.picture = formData.picture;

        onConfirm(updatedData);
    };
    
    return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      <div className="bg-background-light w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
        
        <div className="relative p-4 border-b border-gray-700/50 flex justify-center items-center">
          <h2 className="text-xl font-bold text-text-main text-center">Editar Perfil</h2>
          <button 
            onClick={onClose}
            className="absolute right-4 text-text-muted hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

          <div className="flex flex-col gap-2">
              <label htmlFor="nickname" className="text-sm font-semibold text-gray-300">Apelido</label>
              <input
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="Seu nome de exibição"
                  className="w-full bg-transparent border border-gray-600/50 rounded-xl p-3 text-text-main placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  maxLength={50}
                  autoFocus
              />
          </div>

          <div className="flex flex-col gap-2">
              <label htmlFor="picture" className="text-sm font-semibold text-gray-300">URL da Foto de Perfil</label>
              <input
                  id="picture"
                  name="picture"
                  value={formData.picture}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/suafoto.png"
                  className="w-full bg-transparent border border-gray-600/50 rounded-xl p-3 text-text-main placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
          </div>

          <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2 opacity-60">
                  <label className="text-sm font-semibold text-gray-400">Username</label>
                  <input disabled value={`@${username}`} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-gray-400 cursor-not-allowed" />
              </div>
          </div>

          <div className="mt-4 flex justify-center items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full font-semibold text-text-muted hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center min-w-[120px] px-6 py-2 rounded-full font-bold text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : "Salvar"}
            </button>
          </div>

        </form>
      </div>
    </div>
    );
}