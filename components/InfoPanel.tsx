import React, { useState, useEffect, useRef } from 'react';
import { BrainRegionData, Language, Section, ImageItem } from '../types';
import { X, Save, Edit2, Plus, Trash2, Image as ImageIcon, Upload, Link } from 'lucide-react';

interface InfoPanelProps {
  data: BrainRegionData;
  onClose: () => void;
  onUpdate: (updatedData: BrainRegionData) => void;
  language: Language;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ data, onClose, onUpdate, language }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BrainRegionData>(data);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    setFormData(data);
    setIsEditing(false);
    // Scroll to top when data changes
    if (containerRef.current) {
        containerRef.current.scrollTop = 0;
    }
  }, [data]);

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (id: string, field: keyof Section, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleAddSection = () => {
    const newId = `section-${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections, 
        { 
          id: newId, 
          title: language === 'zh' ? '新板块' : 'New Section', 
          content: '',
          images: []
        }
      ]
    }));
  };

  const handleDeleteSection = (id: string) => {
    if (confirm(language === 'zh' ? '确定删除该板块吗？' : 'Delete this section?')) {
      setFormData(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== id)
      }));
    }
  };

  // Image Handling
  const handleAddImageUrl = (sectionId: string) => {
      const url = prompt(language === 'zh' ? '请输入图片链接:' : 'Enter image URL:');
      if (url) {
          const newImage: ImageItem = {
              id: Date.now().toString(),
              url: url,
              caption: language === 'zh' ? '图片说明' : 'Image Caption'
          };
          setFormData(prev => ({
              ...prev,
              sections: prev.sections.map(s => 
                  s.id === sectionId ? { ...s, images: [...(s.images || []), newImage] } : s
              )
          }));
      }
  };

  const handleFileUpload = (sectionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target?.result) {
                const newImage: ImageItem = {
                    id: Date.now().toString(),
                    url: event.target.result as string,
                    caption: language === 'zh' ? '图片说明' : 'Image Caption'
                };
                setFormData(prev => ({
                    ...prev,
                    sections: prev.sections.map(s => 
                        s.id === sectionId ? { ...s, images: [...(s.images || []), newImage] } : s
                    )
                }));
              }
          };
          reader.readAsDataURL(file);
      }
      // Reset input
      if (e.target) e.target.value = '';
  };

  const handleDeleteImage = (sectionId: string, imageId: string) => {
      setFormData(prev => ({
          ...prev,
          sections: prev.sections.map(s => 
              s.id === sectionId ? { ...s, images: s.images.filter(img => img.id !== imageId) } : s
          )
      }));
  };

  const handleImageCaptionChange = (sectionId: string, imageId: string, caption: string) => {
    setFormData(prev => ({
        ...prev,
        sections: prev.sections.map(s => 
            s.id === sectionId ? { 
                ...s, 
                images: s.images.map(img => img.id === imageId ? { ...img, caption } : img) 
            } : s
        )
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  // Auto-resize textarea logic
  const AutoResizeTextarea = ({ value, onChange, className, placeholder }: { value: string, onChange: (e: any) => void, className: string, placeholder?: string }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            className={className}
            placeholder={placeholder}
            rows={1}
        />
    );
  };

  // Styles
  const labelInputClass = "block text-lg font-bold text-gray-800 dark:text-blue-400 mb-2 mt-6 bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 outline-none w-full transition";
  const labelDisplayClass = "block text-lg font-bold text-gray-800 dark:text-blue-400 mb-2 mt-8 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-slate-800";
  
  const contentInputClass = "w-full bg-transparent border-l-2 border-gray-200 dark:border-slate-700 pl-4 py-1 text-base text-gray-800 dark:text-gray-200 focus:border-blue-500 outline-none transition resize-none overflow-hidden leading-relaxed";
  const contentDisplayClass = "text-base text-gray-600 dark:text-gray-300 leading-7 whitespace-pre-wrap font-serif dark:font-sans";
  
  const headerInputClass = "bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none w-full transition px-1";

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col overflow-y-auto"
    >
      {/* Document Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-start shadow-sm shrink-0">
        <div className="flex-1 mr-8">
           {isEditing ? (
             <div className="space-y-3">
                <input 
                  name={language === 'zh' ? 'nameZh' : 'nameEn'}
                  value={language === 'zh' ? formData.nameZh : formData.nameEn}
                  onChange={handleHeaderChange}
                  className={`${headerInputClass} text-3xl font-bold text-gray-900 dark:text-white`}
                  placeholder={language === 'zh' ? "结构名称 (中)" : "Structure Name (EN)"}
                />
                <input 
                  name={language === 'zh' ? 'nameEn' : 'nameZh'}
                  value={language === 'zh' ? formData.nameEn : formData.nameZh}
                  onChange={handleHeaderChange}
                  className={`${headerInputClass} text-lg font-medium text-blue-500`}
                  placeholder={language === 'zh' ? "Structure Name (EN)" : "结构名称 (中)"}
                />
             </div>
           ) : (
             <>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {language === 'zh' ? formData.nameZh : formData.nameEn}
              </h1>
              <p className="text-lg text-blue-500 font-medium">
                {language === 'zh' ? formData.nameEn : formData.nameZh}
              </p>
             </>
           )}
        </div>
        <div className="flex gap-2 shrink-0">
             {!isEditing ? (
                <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition"
                title={language === 'zh' ? '编辑' : 'Edit'}
                >
                <Edit2 size={20} />
                </button>
            ) : (
                <button
                onClick={handleSave}
                className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition"
                title={language === 'zh' ? '保存' : 'Save'}
                >
                <Save size={20} />
                </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition">
                <X size={20} className="text-gray-500" />
            </button>
        </div>
      </div>

      {/* Document Body */}
      <article className="px-8 py-4 pb-32 max-w-3xl mx-auto w-full flex-1">
        
        {/* Dynamic Sections */}
        {formData.sections.map((section) => (
          <section key={section.id} className="group relative mb-8">
            {/* Section Header */}
            <div className="flex justify-between items-end border-b border-gray-100 dark:border-slate-800/50 pb-2 mb-4">
                {isEditing ? (
                    <div className="w-full">
                         <input
                            value={section.title}
                            onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                            className={labelInputClass.replace('border-b border-transparent', '')}
                            placeholder="Section Title"
                        />
                    </div>
                ) : (
                    <h3 className="text-lg font-bold text-gray-800 dark:text-blue-400">{section.title}</h3>
                )}
                
                {isEditing && (
                    <div className="flex gap-1 ml-2 mb-1">
                         <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={(el) => fileInputRefs.current[section.id] = el}
                            onChange={(e) => handleFileUpload(section.id, e)}
                         />
                         <button 
                            onClick={() => fileInputRefs.current[section.id]?.click()}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                            title="Upload Image"
                        >
                            <Upload size={16} />
                        </button>
                        <button 
                            onClick={() => handleAddImageUrl(section.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                            title="Add Image URL"
                        >
                            <Link size={16} />
                        </button>
                        <button 
                            onClick={() => handleDeleteSection(section.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                            title="Delete Section"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="mb-4">
                {isEditing ? (
                <AutoResizeTextarea
                    className={contentInputClass}
                    value={section.content}
                    onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                />
                ) : (
                <p className={contentDisplayClass}>{section.content || (language === 'zh' ? '(点击编辑添加内容)' : '(Click edit to add content)')}</p>
                )}
            </div>

            {/* Images Grid */}
            {section.images && section.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {section.images.map((img) => (
                        <div key={img.id} className="relative group/image rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm bg-gray-50 dark:bg-slate-800">
                             <img 
                                src={img.url} 
                                alt={img.caption} 
                                className="w-full h-48 object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Error'; }}
                             />
                             {isEditing && (
                                 <button 
                                    onClick={() => handleDeleteImage(section.id, img.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/image:opacity-100 transition shadow-md"
                                 >
                                     <X size={14} />
                                 </button>
                             )}
                             <div className="p-2 border-t border-gray-100 dark:border-slate-700">
                                 {isEditing ? (
                                     <input 
                                        value={img.caption}
                                        onChange={(e) => handleImageCaptionChange(section.id, img.id, e.target.value)}
                                        className="w-full bg-transparent text-sm text-center outline-none text-gray-600 dark:text-gray-300 placeholder-gray-400"
                                        placeholder={language === 'zh' ? "添加说明..." : "Add caption..."}
                                     />
                                 ) : (
                                     <p className="text-sm text-center text-gray-500 dark:text-gray-400 font-medium">
                                         {img.caption}
                                     </p>
                                 )}
                             </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Empty state for images when editing */}
            {isEditing && (!section.images || section.images.length === 0) && (
                <div className="mt-4 p-4 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-lg flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                    <ImageIcon size={24} className="mb-2 opacity-50" />
                    <span className="text-xs">{language === 'zh' ? '暂无图片 - 点击上方按钮添加' : 'No images - Click icon above to add'}</span>
                </div>
            )}

          </section>
        ))}

        {/* Add Section Button (Bottom) */}
        {isEditing && (
            <button
                onClick={handleAddSection}
                className="w-full mt-8 py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition flex items-center justify-center gap-2 text-sm font-medium"
            >
                <Plus size={18} />
                {language === 'zh' ? '添加新板块' : 'Add New Section'}
            </button>
        )}
      </article>
    </div>
  );
};

export default InfoPanel;