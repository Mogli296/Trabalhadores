import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, CheckCircle2, AlertCircle, Video, Image as ImageIcon, Sparkles, Plus, User, Compass } from 'lucide-react';
import { api } from '../services/api';

interface GalleryItem {
  id: string;
  workerName: string;
  profession: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  createdAt: string;
}

export default function MediaGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Custom metadata overlay fields for upload completion
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadedType, setUploadedType] = useState<'image' | 'video'>('image');
  const [metaName, setMetaName] = useState('');
  const [metaProfession, setMetaProfession] = useState('Carpinteiro');
  const [metaCaption, setMetaCaption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch from the real server-side list
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await api.getGallery();
      setItems(data);
    } catch (err: any) {
      console.error("Error loading gallery data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    // Check if image or video
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setErrorMessage("Please select only valid image (.png, .jpg) or video (.mp4) files.");
      return;
    }

    // Limit to 10MB to prevent heavy payload issues
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("The file size exceeds the 10MB trial platform upload limit.");
      return;
    }

    setUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        // Execute real upload on our custom backend
        const uploadResponse = await api.uploadMedia(file.name, base64data);
        
        setUploadedUrl(uploadResponse.url);
        setUploadedType(isImage ? 'image' : 'video');
        setMetaCaption('');
        setMetaName('');
        setDragActive(false);
        setUploading(false);
        setShowMetaModal(true);
      };
    } catch (error: any) {
      console.error(error);
      setErrorMessage("An error occurred while processing your file. Please try again.");
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleMetaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metaName.trim() || !metaCaption.trim()) {
      setErrorMessage("Please fill out all required fields to register.");
      return;
    }

    try {
      setUploading(true);
      await api.addToGallery({
        workerName: metaName,
        profession: metaProfession,
        type: uploadedType,
        url: uploadedUrl,
        caption: metaCaption
      });

      setSuccessMessage("Media successfully added to the general showcase gallery!");
      setShowMetaModal(false);
      fetchGallery(); // Refresh feed
    } catch (err: any) {
      setErrorMessage("Failed to submit media records to the server.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div id="media-gallery-section" className="space-y-12 py-16 px-4 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
      
      {/* Header and Context details with nice green highlights */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/25 px-4.5 py-2 rounded-full inline-flex items-center gap-1.5 uppercase tracking-widest shadow-lg shadow-emerald-950/20">
          <Sparkles size={11} className="text-emerald-400 animate-pulse" />
          REAL-WORLD PLACEMENTS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight font-display">
          Candidate Media & Project Showcase
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed font-sans max-w-xl mx-auto">
          Explore on-site photos and short clips uploaded by our global community highlighting their active projects.
        </p>
      </div>

      {/* Main Container - Centered and Green Accentuated */}
      <div className="w-full">
        {loading ? (
          <div className="p-12 text-center bg-[#030614]/40 border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
            <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-emerald-400 animate-spin" />
            <p className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Syncing deployment details...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center bg-[#030614]/40 border border-white/5 rounded-3xl max-w-md mx-auto">
            <span className="text-3xl block">📁</span>
            <p className="text-xs font-mono uppercase text-zinc-500 tracking-wider mt-3">No files showcase on database yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-center">
            {items.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  className="bg-[#030614]/85 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-xl hover:border-emerald-500/25 transition-all duration-300 relative"
                >
                  {/* Media item rendering */}
                  <div className="relative aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
                    {item.type === 'video' ? (
                      <video 
                        src={item.url} 
                        controls 
                        className="w-full h-full object-cover"
                        poster="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
                      />
                    ) : (
                      <img 
                        src={item.url} 
                        alt={item.caption} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                      />
                    )}

                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[8px] font-mono font-black text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-full border border-emerald-550/20 uppercase tracking-widest flex items-center gap-1">
                        {item.type === 'video' ? <Video size={9} /> : <ImageIcon size={9} />}
                        {item.type === 'video' ? 'Seasonal Video' : 'Job Site Photo'}
                      </span>
                    </div>
                  </div>

                  {/* Metadata display content */}
                  <div className="p-5 text-left space-y-2 bg-[#04081e]/60 border-t border-white/5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-zinc-350 leading-relaxed font-sans font-medium text-justify italic">
                      "{item.caption}"
                    </p>
                    
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/[0.03]">
                      <div className="flex items-center gap-2">
                        <div className="w-6.5 h-6.5 rounded-lg bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <User size={10} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-white block truncate uppercase tracking-tight">{item.workerName}</span>
                          <span className="text-[8px] text-zinc-500 font-mono block uppercase tracking-widest">{item.profession}</span>
                        </div>
                      </div>

                      <span className="text-[8px] text-zinc-500 font-mono tracking-wider shrink-0 uppercase">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      {/* Meta Information overlay popup */}
      <AnimatePresence>
        {showMetaModal && (
          <div className="fixed inset-0 bg-[#01020d]/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#030614] border border-white/10 p-6 rounded-3xl max-w-md w-full space-y-6 text-left shadow-2xl relative"
            >
              <div>
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-wider bg-emerald-950/40 px-2.5 py-1.5 rounded-full border border-emerald-550/20">VERIFICATION STEP</span>
                <h3 className="text-lg font-extrabold text-white uppercase tracking-tight mt-3">Identify Your Media</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Enter your professional details to complete the upload and share your experience with the matching pool.</p>
              </div>

              <form onSubmit={handleMetaSubmit} className="space-y-4 font-sans">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-450 tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Carlos Silva"
                    value={metaName}
                    onChange={(e) => setMetaName(e.target.value)}
                    className="w-full text-xs text-white bg-[#0b1028]/80 border border-white/10 p-3 rounded-xl focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-650"
                  />
                </div>

                {/* Profession selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-450 tracking-wider">Select Trade Profession</label>
                  <select
                    value={metaProfession}
                    onChange={(e) => setMetaProfession(e.target.value)}
                    className="w-full text-xs text-white bg-[#0b1028]/80 border border-white/10 p-3 rounded-xl focus:border-emerald-500/50 outline-none transition-all cursor-pointer font-bold"
                  >
                    <option value="Carpenter">Carpenter</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Forklift Operator">Forklift Operator</option>
                    <option value="Cargo Assistant">Cargo Assistant</option>
                  </select>
                </div>

                {/* Legend caption */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-black uppercase text-zinc-450 tracking-wider">Short Caption / Project Description</label>
                  <textarea
                    required
                    placeholder="Describe your task, environment, or the project shown above."
                    value={metaCaption}
                    onChange={(e) => setMetaCaption(e.target.value)}
                    maxLength={150}
                    rows={3}
                    className="w-full text-xs text-white bg-[#0b1028]/80 border border-white/10 p-3 rounded-xl focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-650 resize-none font-medium leading-relaxed"
                  />
                  <p className="text-[9px] text-zinc-650 text-right font-mono tracking-widest leading-none">MAXIMUM 150 CHARACTERS</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMetaModal(false);
                      setUploadedUrl('');
                    }}
                    className="text-xs uppercase font-mono px-4 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#01020d] font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Publish Media
                    <Plus size={13} className="stroke-[3]" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
