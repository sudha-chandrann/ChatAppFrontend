import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Image, Video, File, Download, User } from 'lucide-react';

function MediaPage() {
  const params = useParams();
  const conversationId = params.conversationId;
  const [imageMedia, setImageMedia] = useState([]);
  const [videoMedia, setVideoMedia] = useState([]);
  const [fileMedia, setFileMedia] = useState([]);
  const [activeTab, setActiveTab] = useState('images');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
   
  const getConversationMediaInformation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/conversations/mediainformation/${conversationId}`,
        {
          withCredentials: true,
        }
      );
      const responseData = response.data.data;
      setFileMedia(responseData.file || []);
      setImageMedia(responseData.image || []);
      setVideoMedia(responseData.video || []);

    } catch (err) {
      console.log("Error getting conversation details:", err);
      setError("Failed to load conversation media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(conversationId) {
      getConversationMediaInformation();
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleDownload = (url) => {
    // Open in new tab
    window.open(url, '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderSenderInfo = (sender) => {
    return (
      <div className="flex items-center">
        {sender.profilePicture ? (
          <img 
            src={sender.profilePicture} 
            alt={sender.username} 
            className="w-6 h-6 rounded-full mr-2 object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
            <User className="h-3 w-3 text-gray-400" />
          </div>
        )}
        <span className="text-sm truncate">{sender.username}</span>
      </div>
    );
  };

  const renderMedia = () => {
    let mediaToShow = [];
    
    switch(activeTab) {
      case 'images':
        mediaToShow = imageMedia;
        break;
      case 'videos':
        mediaToShow = videoMedia;
        break;
      case 'files':
        mediaToShow = fileMedia;
        break;
      default:
        mediaToShow = imageMedia;
    }

    if (mediaToShow.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3">
            {activeTab === 'images' && <Image className="h-8 w-8 text-gray-500" />}
            {activeTab === 'videos' && <Video className="h-8 w-8 text-gray-500" />}
            {activeTab === 'files' && <File className="h-8 w-8 text-gray-500" />}
          </div>
          <p>No {activeTab} found in this conversation</p>
        </div>
      );
    }

    if (activeTab === 'images') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaToShow.map((item) => (
            <div 
              key={item._id} 
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-800 cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              <img 
                src={item.mediaUrl} 
                alt={item.mediaName || "Image"} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-center mb-1">
                  {renderSenderInfo(item.sender)}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item.mediaUrl, item.mediaName);
                    }}
                    className="p-1 text-white hover:text-green-400"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-300">{formatDate(item.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'videos') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaToShow.map((item) => (
            <div key={item._id} className="bg-gray-800 rounded-lg overflow-hidden">
              <video 
                src={item.mediaUrl} 
                className="w-full aspect-video object-cover" 
                controls
              />
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  {renderSenderInfo(item.sender)}
                  <button 
                    onClick={() => handleDownload(item.mediaUrl, item.mediaName)}
                    className="p-1 text-white hover:text-green-400"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-white truncate">{item.mediaName || "Video"}</p>
                  <p className="text-xs text-gray-400">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'files') {
      return (
        <div className="space-y-3">
          {mediaToShow.map((item) => (
            <div key={item._id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center mr-3">
                    <File className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-white truncate max-w-xs sm:max-w-md">{item.mediaName || "File"}</p>
                    <p className="text-xs text-gray-400">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end mt-2 sm:mt-0">
                  {renderSenderInfo(item.sender)}
                  <button 
                    onClick={() => handleDownload(item.mediaUrl, item.mediaName)}
                    className="p-2 ml-4 text-white hover:text-green-400"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="py-4 px-6 border-b border-gray-700 flex items-center">
        <Link to={`/dashboard/conversation/${conversationId}/information`} className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-white" />
        </Link>
        <h1 className="text-xl font-semibold">Media</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button 
          className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'images' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('images')}
        >
          <div className="flex items-center justify-center">
            <Image className="h-4 w-4 mr-2" />
            <span>Images ({imageMedia.length})</span>
          </div>
        </button>
        <button 
          className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'videos' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('videos')}
        >
          <div className="flex items-center justify-center">
            <Video className="h-4 w-4 mr-2" />
            <span>Videos ({videoMedia.length})</span>
          </div>
        </button>
        <button 
          className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'files' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('files')}
        >
          <div className="flex items-center justify-center">
            <File className="h-4 w-4 mr-2" />
            <span>Files ({fileMedia.length})</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {renderMedia()}
      </div>

      {/* Image Preview Modal */}
      {selectedMedia && activeTab === 'images' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedMedia.mediaUrl} 
              alt={selectedMedia.mediaName || "Image"} 
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3">
              <div className="flex justify-between items-center mb-1">
                {renderSenderInfo(selectedMedia.sender)}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(selectedMedia.mediaUrl, selectedMedia.mediaName);
                  }}
                  className="p-2 text-white hover:text-green-400"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white truncate">{selectedMedia.mediaName}</span>
                <span className="text-xs text-gray-300">{formatDate(selectedMedia.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaPage;