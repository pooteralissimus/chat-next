// import React, { useState, useEffect, useRef } from 'react'
// import Image from 'next/image'
// import '@/styles/Chat.css'
// import { fixJSON } from '@/utils/parser'

// const Chat: React.FC = ({ thread }) => {
//    const [isCollapsed, setIsCollapsed] = useState(true)
//    const [messages, setMessages] = useState<Array<{ text: string; isRight: boolean; isAssistant?: boolean }>>([
//       { text: 'Hi, How can I help you?', isRight: false, isAssistant: true },
//    ])
//    const [inputValue, setInputValue] = useState('')
//    const [showConsultation, setShowConsultation] = useState(false)
//    const [showConsultationMessage, setShowConsultationMessage] = useState(false)
//    const [showChatServices, setShowChatServices] = useState(false)
//    const [isChatVisible, setIsChatVisible] = useState(true)
//    const [hasUserSentMessage, setHasUserSentMessage] = useState(false)
//    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false)
//    const [isInputDisabled, setIsInputDisabled] = useState(false)
//    const [isAssistantTyping, setIsAssistantTyping] = useState(false)
//    const chatBodyRef = useRef<HTMLDivElement>(null)
//    const optionsDropdownRef = useRef<HTMLDivElement>(null)

//    useEffect(() => {
//       const savedState = localStorage.getItem('chatState')
//       if (savedState) {
//          const parsedState = JSON.parse(savedState)
//          setMessages(parsedState.messages)
//          setShowConsultation(parsedState.showConsultation)
//          setShowConsultationMessage(parsedState.showConsultationMessage)
//          setHasUserSentMessage(parsedState.hasUserSentMessage)
//          setIsCollapsed(parsedState.isCollapsed)
//          setShowChatServices(parsedState.showChatServices)
//       }
//    }, [])

//    useEffect(() => {
//       localStorage.setItem('chatState', JSON.stringify({
//          messages,
//          showConsultation,
//          showConsultationMessage,
//          hasUserSentMessage,
//          isCollapsed,
//          showChatServices,
//       }))
//    }, [messages, showConsultation, showConsultationMessage, hasUserSentMessage, isCollapsed, showChatServices])

//    useEffect(() => {
//       const handleClickOutside = (event: MouseEvent) => {
//          if (optionsDropdownRef.current && !optionsDropdownRef.current.contains(event.target as Node)) {
//             setShowOptionsDropdown(false)
//          }
//       }

//       document.addEventListener('mousedown', handleClickOutside)
//       return () => {
//          document.removeEventListener('mousedown', handleClickOutside)
//       }
//    }, [])

//    const toggleChatCollapse = () => {
//       setIsCollapsed(!isCollapsed)
//       setIsChatVisible(true)
//    }

//    const toggleOptionsDropdown = (event: React.MouseEvent) => {
//       event.stopPropagation()
//       setShowOptionsDropdown(prev => !prev)
//    }

//    const displayMessage = (text: string, isRight: boolean, isAssistant = false) => {
//       setMessages(prev => [...prev, { text, isRight, isAssistant }])
//       if (!hasUserSentMessage) {
//          setHasUserSentMessage(true)
//       }
//    }

//    const handleAssistantResponse = (assistantMessage: any) => {
//       setIsAssistantTyping(false)
//       setIsInputDisabled(false)

//       if (assistantMessage?.json?.schedule === true) {
//          displayMessage("Would you like to schedule a paid consultation with one of our experts to get more in-depth assistance?", false, true)
//          setShowConsultationMessage(true)
//          setShowChatServices(false)
//       } else {
//          displayMessage(assistantMessage?.json?.response || assistantMessage, false, true)
//       }
//    }

//    const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault()
//       if (inputValue.trim() && !isInputDisabled) {
//          displayMessage(inputValue, true)
//          setInputValue('')
//          setShowConsultation(true)
//          setIsInputDisabled(true)
//          setIsAssistantTyping(true)

//          try {
//             const response = await fetch('/api/send-message', {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify({ message: inputValue, thread: thread }),
//             })

//             if (!response.ok) {
//                throw new Error('Network response was not ok')
//             }

//             const res = await response.json()
//             const assistantMessage = fixJSON(res.data)
//             handleAssistantResponse(assistantMessage)
//          } catch (error) {
//             console.error('Error during fetch:', error)
//             setIsInputDisabled(false)
//             setIsAssistantTyping(false)
//          }
//       }
//    }

//    const handleConsultantClick = () => {
//       if (isCollapsed) {
//          setIsCollapsed(false)
//       }
//       setShowConsultation(true)
//       displayMessage('I would like to chat with a consultant', true)

//       setTimeout(() => {
//          displayMessage('Would you like to schedule a paid consultation with one of our experts to get more in-depth assistance?', false, true)
//          setShowConsultationMessage(true)
//       }, Math.random() * 500 + 1000)
//    }

//    const handleServicesClick = () => {
//       if (isCollapsed) {
//          setIsCollapsed(false)
//       }
//       setShowConsultation(true)
//       displayMessage('I\'d like to better understand your services', true)

//       setTimeout(() => {
//          displayMessage('Which services are you most interested in?', false, true)
//          setShowChatServices(true)
//       }, Math.random() * 500 + 1000)
//    }

//    const handleServiceOptionClick = (service: string) => {
//       displayMessage(service, true)
//       setShowChatServices(false)
//       setIsInputDisabled(true)
//       setIsAssistantTyping(true)

//       fetch('/api/send-message', {
//          method: 'POST',
//          headers: { 'Content-Type': 'application/json' },
//          body: JSON.stringify({ message: service, thread: thread }),
//       })
//          .then(response => response.json())
//          .then(data => {
//             const assistantMessage = fixJSON(data.data)
//             handleAssistantResponse(assistantMessage)
//          })
//          .catch(error => {
//             console.error('Error during fetch:', error)
//             setIsInputDisabled(false)
//             setIsAssistantTyping(false)
//          })
//    }

//    const handleSupportClick = () => {
//       if (isCollapsed) {
//          setIsCollapsed(false)
//       }
//       setShowConsultation(true)
//       displayMessage('I\'m a customer and need support', true)
//       setIsInputDisabled(true)
//       setIsAssistantTyping(true)

//       fetch('/api/send-message', {
//          method: 'POST',
//          headers: { 'Content-Type': 'application/json' },
//          body: JSON.stringify({ message: 'I\'m a customer and need support', thread: thread }),
//       })
//          .then(response => response.json())
//          .then(data => {
//             const assistantMessage = fixJSON(data.data)
//             handleAssistantResponse(assistantMessage)
//          })
//          .catch(error => {
//             console.error('Error during fetch:', error)
//             setIsInputDisabled(false)
//             setIsAssistantTyping(false)
//          })
//    }

//    const handleRestoreChat = () => {
//       setMessages([{ text: 'Hi, How can I help you?', isRight: false, isAssistant: true }])
//       setShowConsultation(false)
//       setShowConsultationMessage(false)
//       setHasUserSentMessage(false)
//       setIsCollapsed(true)
//       setShowChatServices(false)
//       setShowOptionsDropdown(false)
//       setIsInputDisabled(false)
//       setIsAssistantTyping(false)
//       localStorage.removeItem('chatState')
//    }

//    const handleCloseChat = () => {
//       setIsChatVisible(false)
//    }

//    useEffect(() => {
//       if (chatBodyRef.current) {
//          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
//       }
//    }, [messages])

//    return (
//       <>
//          {isChatVisible && (
//             <div className={`chat-container ${isCollapsed ? 'chat-container-collapsed' : ''} ${showConsultation ? 'chat-container-after' : ''}`}>
//                <div className={`chat-header ${isCollapsed ? 'chat-header-collapsed' : ''} ${showConsultation ? 'chat-header-after' : ''}`}>
//                   <div className='chat-title'>
//                      <div className='chat-title-first-row'>
//                         <div className='options-dropdown-container' ref={optionsDropdownRef}>
//                            <button onClick={toggleOptionsDropdown} className={`options-icon ${showConsultation ? '' : 'hidden'}`}>
//                               <Image src='/images/icons/options.svg' alt='options' width={24} height={24} />
//                            </button>
//                            {showOptionsDropdown && (
//                               <div className='options-menu'>
//                                  <button onClick={handleRestoreChat}>Restore chat</button>
//                               </div>
//                            )}
//                         </div>
//                         <Image src='/images/icons/logo-orange.png' alt='Header Logo' className={`chat-header-title-logo ${showConsultation ? '' : 'hidden'}`} width={32} height={32} />
//                         <button type='button' className={`chat-back ${showConsultation ? 'hidden' : ''}`} onClick={toggleChatCollapse}>
//                            <Image src='/images/icons/arrow-back.svg' alt='arrow-back' width={24} height={24} />
//                         </button>
//                         <h2 className={`chat-title-title ${showConsultation ? 'chat-title-title-after' : ''}`}>Diversified Nurse Consultants</h2>
//                         <div className={`chat-header-right-actions ${showConsultation ? '' : 'hidden'}`}>
//                            <button type='button' className='chat-header-collapse' onClick={toggleChatCollapse}>
//                               <Image src='/images/icons/collapse-minus.svg' alt='collapse' width={16} height={16} />
//                            </button>
//                            <button type='button' className='chat-header-close' onClick={handleCloseChat}>
//                               <Image src='/images/icons/close-x.svg' alt='Close' width={16} height={16} />
//                            </button>
//                         </div>
//                      </div>
//                      <p className={`chat-title-paragraph ${showConsultation ? 'hidden' : ''}`}>Start a chat to get immediate answers to your questions, personalized guidance, and support tailored to your needs. Chat with us now for quick and friendly assistance.</p>
//                   </div>
//                </div>

//                <div className='chat-body' ref={chatBodyRef}>
//                   <div className={`chat-date small-text ${showConsultation ? '' : 'hidden'}`}>Today</div>
//                   {messages.map((message, index) => (
//                      message.isAssistant ? (
//                         <div key={index} className='message-assistant-container'>
//                            <div className={`message message-assistant message-left ${showConsultation ? 'message-assistant-after' : ''}`}>
//                               <div className={`message-assistant-logo ${showConsultation ? 'message-assistant-logo-after' : 'message-assistant-logo-initial'}`}>
//                                  <Image src={showConsultation ? '/images/icons/logo-white.png' : '/images/icons/logo.png'} alt='Consultants Logo' className='message-logo' width={32} height={32} />
//                               </div>
//                               <div className={`message-assistant-logo ${showConsultation ? 'message-assistant-logo-initial hidden' : 'message-assistant-logo-after hidden'}`}>
//                                  <Image src={showConsultation ? '/images/icons/logo.png' : '/images/icons/logo-white.png'} alt='Consultants Logo' className='message-logo' width={32} height={32} />
//                               </div>
//                               <div className='message-assistant-info'>
//                                  <span id='diversified' className={showConsultation ? 'hidden' : ''}>Diversified Nurse Consultants</span>
//                                  <p className='message-assistant-text text'>{message.text}</p>
//                               </div>
//                            </div>
//                            <div className={`message-assistant-small small-text ${showConsultation ? '' : 'hidden'}`}>
//                               Bot · <span id='message-time'>1h</span> ago
//                            </div>
//                         </div>
//                      ) : (
//                         <div key={index} className='chat-options user-messages'>
//                            <div className='text message message-right user-message-after'>{message.text}</div>
//                         </div>
//                      )
//                   ))}
//                   {isAssistantTyping && (
//                      <div className='message-assistant-container'>
//                         <div className='typing-indicator'>
//                            <span></span>
//                            <span></span>
//                            <span></span>
//                         </div>
//                      </div>
//                   )}
//                   {!hasUserSentMessage && (
//                      <div className='chat-options user-messages'>
//                         <button type='button' id='button-consultant' className='chat-option text message message-right' onClick={handleConsultantClick}>Chat with consultant</button>
//                         <button type='button' id='button-services' className='chat-option text message message-right' onClick={handleServicesClick}>Learn more about services</button>
//                         <button type='button' id='button-support' className='chat-option text message message-right' onClick={handleSupportClick}>I'm a customer and need support</button>
//                      </div>
//                   )}
//                   {!showConsultationMessage && !showChatServices && (
//                      <form onSubmit={handleSubmit} className={`chat-input-form ${isCollapsed ? 'chat-input-form-collapsed' : ''}`}>
//                         <input
//                            type='text'
//                            placeholder='Your answer...'
//                            className='chat-input'
//                            value={inputValue}
//                            onChange={(e) => setInputValue(e.target.value)}
//                            disabled={isInputDisabled}
//                         />
//                         <button type='submit' className='send-button' disabled={isInputDisabled}>
//                            <Image src='../../images/icons/arrow-send.svg' alt='Send' width={24} height={24} />
//                         </button>
//                      </form>
//                   )}
//                </div>

//                {showConsultationMessage && (
//                   <div className='chat-consultation'>
//                      <p className='consultation-text'>Click here to book your session and get the personalized help you need.</p>
//                      <a href='https://dnconsult.org/book-your-call/' className='consultation-button button'>Book a consultation</a>
//                   </div>
//                )}

//                {showChatServices && (
//                   <div className='chat-services'>
//                      <button type='button' className='chat-option' onClick={() => handleServiceOptionClick('Transitional Care Management')}>Transitional Care Management</button>
//                      <button type='button' className='chat-option' onClick={() => handleServiceOptionClick('Relocation Support')}>Relocation Support</button>
//                      <button type='button' className='chat-option' onClick={() => handleServiceOptionClick('Alzheimer\'s/Dementia Management')}>Alzheimer's/Dementia Management</button>
//                   </div>
//                )}
//             </div>
//          )}
//          <button className='collapse-button' onClick={toggleChatCollapse}>
//             <Image
//                src={isCollapsed ? '/images/icons/chat-icon.svg' : '/images/icons/arrow-down.svg'}
//                alt='Collapse'
//                width={24}
//                height={24}
//             />
//          </button>
//       </>
//    )
// }

// export default Chat

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import '@/styles/Chat.css'
import { fixJSON } from '@/utils/parser'

const Chat: React.FC = ({ thread }) => {
   const [isCollapsed, setIsCollapsed] = useState(true)
   const [messages, setMessages] = useState<Array<{ text: string; isRight: boolean; isAssistant?: boolean; isNew?: boolean }>>([
      { text: 'Hi, How can I help you?', isRight: false, isAssistant: true },
   ])
   const [inputValue, setInputValue] = useState('')
   const [showConsultation, setShowConsultation] = useState(false)
   const [showConsultationMessage, setShowConsultationMessage] = useState(false)
   const [showChatServices, setShowChatServices] = useState(false)
   const [isChatVisible, setIsChatVisible] = useState(true)
   const [isClosing, setIsClosing] = useState(false)
   const [hasUserSentMessage, setHasUserSentMessage] = useState(false)
   const [showOptionsDropdown, setShowOptionsDropdown] = useState(false)
   const [isInputDisabled, setIsInputDisabled] = useState(false)
   const [isAssistantTyping, setIsAssistantTyping] = useState(false)
   const chatBodyRef = useRef<HTMLDivElement>(null)
   const optionsDropdownRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const savedState = localStorage.getItem('chatState')
      if (savedState) {
         const parsedState = JSON.parse(savedState)
         setMessages(parsedState.messages)
         setShowConsultation(parsedState.showConsultation)
         setShowConsultationMessage(parsedState.showConsultationMessage)
         setHasUserSentMessage(parsedState.hasUserSentMessage)
         setIsCollapsed(parsedState.isCollapsed)
         setShowChatServices(parsedState.showChatServices)
      }
   }, [])

   useEffect(() => {
      localStorage.setItem('chatState', JSON.stringify({
         messages,
         showConsultation,
         showConsultationMessage,
         hasUserSentMessage,
         isCollapsed,
         showChatServices,
      }))
   }, [messages, showConsultation, showConsultationMessage, hasUserSentMessage, isCollapsed, showChatServices])

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (optionsDropdownRef.current && !optionsDropdownRef.current.contains(event.target as Node)) {
            setShowOptionsDropdown(false)
         }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [])

   const toggleChatCollapse = () => {
      if (!isChatVisible) {
         setIsChatVisible(true)
      }
      setIsCollapsed(!isCollapsed)
   }

   const toggleOptionsDropdown = (event: React.MouseEvent) => {
      event.stopPropagation()
      setShowOptionsDropdown(prev => !prev)
   }

   const displayMessage = (text: string, isRight: boolean, isAssistant = false) => {
      setMessages(prev => [...prev, { text, isRight, isAssistant, isNew: true }])
      if (!hasUserSentMessage) {
         setHasUserSentMessage(true)
      }
      setTimeout(() => {
         setMessages(prev => prev.map(msg => ({ ...msg, isNew: false })))
      }, 300)
   }

   const handleAssistantResponse = (assistantMessage: any) => {
      setIsAssistantTyping(false)
      setIsInputDisabled(false)

      if (assistantMessage?.json?.schedule === true) {
         displayMessage("Would you like to schedule a paid consultation with one of our experts to get more in-depth assistance?", false, true)
         setShowConsultationMessage(true)
         setShowChatServices(false)
      } else {
         displayMessage(assistantMessage?.json?.response || assistantMessage, false, true)
      }
   }

   const sendMessage = async (message: string) => {
      try {
         const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, thread: thread }),
         })

         if (!response.ok) {
            throw new Error('Network response was not ok')
         }

         const res = await response.json()
         const assistantMessage = fixJSON(res.data)
         setTimeout(() => handleAssistantResponse(assistantMessage), 1000)
      } catch (error) {
         console.error('Error during fetch:', error)
         setIsInputDisabled(false)
         setIsAssistantTyping(false)
      }
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (inputValue.trim() && !isInputDisabled) {
         displayMessage(inputValue, true)
         setInputValue('')
         setShowConsultation(true)
         setIsInputDisabled(true)

         setTimeout(() => {
            setIsAssistantTyping(true)
            sendMessage(inputValue)
         }, 1000)
      }
   }

   const handleConsultantClick = () => {
      if (isCollapsed) {
         setIsCollapsed(false)
      }
      setShowConsultation(true)
      displayMessage('I would like to chat with a consultant', true)

      setTimeout(() => {
         setIsAssistantTyping(true)
      }, 1000)

      setTimeout(() => {
         setIsAssistantTyping(false)
         displayMessage('Would you like to schedule a paid consultation with one of our experts to get more in-depth assistance?', false, true)
         setShowConsultationMessage(true)
      }, Math.random() * 1000 + 4000)
   }

   const handleServicesClick = () => {
      if (isCollapsed) {
         setIsCollapsed(false)
      }
      setShowConsultation(true)
      displayMessage('I\'d like to better understand your services', true)

      setTimeout(() => {
         setIsAssistantTyping(true)
      }, 1000)

      setTimeout(() => {
         setIsAssistantTyping(false)
         displayMessage('Which services are you most interested in?', false, true)
         setShowChatServices(true)
      }, Math.random() * 1000 + 4000)
   }


   const handleServiceOptionClick = (service: string) => {
      displayMessage(service, true)
      setShowChatServices(false)
      setIsInputDisabled(true)

      setTimeout(() => {
         setIsAssistantTyping(true)
      }, 1000)

      setTimeout(() => {
         sendMessage(service)
      }, 2000)
   }

   const handleSupportClick = () => {
      if (isCollapsed) {
         setIsCollapsed(false)
      }
      setShowConsultation(true)
      displayMessage('I\'m a customer and need support', true)
      setIsInputDisabled(true)

      setTimeout(() => {
         setIsAssistantTyping(true)
      }, 1000)

      setTimeout(() => {
         sendMessage('I\'m a customer and need support')
      }, 2000)
   }

   const handleRestoreChat = () => {
      setMessages([{ text: 'Hi, How can I help you?', isRight: false, isAssistant: true }])
      setShowConsultation(false)
      setShowConsultationMessage(false)
      setHasUserSentMessage(false)
      setIsCollapsed(true)
      setShowChatServices(false)
      setShowOptionsDropdown(false)
      setIsInputDisabled(false)
      setIsAssistantTyping(false)
      localStorage.removeItem('chatState')
   }

   const handleCloseChat = () => {
      setIsClosing(true)
      setTimeout(() => {
         setIsChatVisible(false)
         setIsCollapsed(true)
         setIsClosing(false)
      }, 300)
   }

   useEffect(() => {
      if (chatBodyRef.current) {
         chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
      }
   }, [messages])

   return (
      <>
         {isChatVisible && (
            <div className={`chat-container ${isCollapsed ? 'chat-container-collapsed' : ''} ${showConsultation ? 'chat-container-after' : ''} ${isClosing ? 'chat-container-closing' : ''}`}>
               <div className={`chat-header ${isCollapsed ? 'chat-header-collapsed' : ''} ${showConsultation ? 'chat-header-after' : ''}`}>
                  <div className='chat-title'>
                     <div className='chat-title-first-row'>
                        <div className='options-dropdown-container' ref={optionsDropdownRef}>
                           <button onClick={toggleOptionsDropdown} className={`options-icon ${showConsultation ? '' : 'hidden'}`}>
                              <Image src='/images/icons/options.svg' alt='options' width={24} height={24} />
                           </button>
                           {showOptionsDropdown && (
                              <div className='options-menu'>
                                 <button onClick={handleRestoreChat}>Restore chat</button>
                              </div>
                           )}
                        </div>
                        <Image src='/images/icons/logo-orange.png' alt='Header Logo' className={`chat-header-title-logo ${showConsultation ? '' : 'hidden'}`} width={32} height={32} />
                        <button type='button' className={`chat-back ${showConsultation ? 'hidden' : ''}`} onClick={toggleChatCollapse}>
                           <Image src='/images/icons/arrow-back.svg' alt='arrow-back' width={24} height={24} />
                        </button>
                        <h2 className={`chat-title-title ${showConsultation ? 'chat-title-title-after' : ''}`}>Diversified Nurse Consultants</h2>
                        <div className={`chat-header-right-actions ${showConsultation ? '' : 'hidden'}`}>
                           <button type='button' className='chat-header-collapse' onClick={toggleChatCollapse}>
                              <Image src='/images/icons/collapse-minus.svg' alt='collapse' width={16} height={16} />
                           </button>
                           <button type='button' className='chat-header-close' onClick={handleCloseChat}>
                              <Image src='/images/icons/close-x.svg' alt='Close' width={16} height={16} />
                           </button>
                        </div>
                     </div>
                     <p className={`chat-title-paragraph ${showConsultation ? 'hidden' : ''}`}>Start a chat to get immediate answers to your questions, personalized guidance, and support tailored to your needs. Chat with us now for quick and friendly assistance.</p>
                  </div>
               </div>

               <div className='chat-body' ref={chatBodyRef}>
                  <div className={`chat-date small-text ${showConsultation ? '' : 'hidden'} ${isCollapsed ? 'text-white' : ''}`}>Today</div>
                  {messages.map((message, index) => (
                     message.isAssistant ? (
                        <div key={index} className={`message-assistant-container ${message.isNew ? 'message-appear' : ''}`}>
                           <div className={`message message-assistant message-left ${showConsultation ? 'message-assistant-after' : ''}`}>
                              <div className={`message-assistant-logo ${showConsultation ? 'message-assistant-logo-after' : 'message-assistant-logo-initial'}`}>
                                 <Image src={showConsultation ? '/images/icons/logo-white.png' : '/images/icons/logo.png'} alt='Consultants Logo' className='message-logo' width={32} height={32} />
                              </div>
                              <div className={`message-assistant-logo ${showConsultation ? 'message-assistant-logo-initial hidden' : 'message-assistant-logo-after hidden'}`}>
                                 <Image src={showConsultation ? '/images/icons/logo.png' : '/images/icons/logo-white.png'} alt='Consultants Logo' className='message-logo' width={32} height={32} />
                              </div>
                              <div className='message-assistant-info'>
                                 <span id='diversified' className={showConsultation ? 'hidden' : ''}>Diversified Nurse Consultants</span>
                                 <p className='message-assistant-text text'>{message.text}</p>
                              </div>
                           </div>
                           <div className={`message-assistant-small small-text ${showConsultation ? '' : 'hidden'} ${isCollapsed ? 'text-white' : ''}`}>
                              Bot · <span id='message-time'>1h</span> ago
                           </div>
                        </div>
                     ) : (
                        <div key={index} className={`chat-options user-messages ${message.isNew ? 'message-appear' : ''}`}>
                           <div className='text message message-right user-message-after'>{message.text}</div>
                        </div>
                     )
                  ))}
                  {isAssistantTyping && (
                     <div className='message-assistant-container message-appear'>
                        <div className='typing-indicator'>
                           <span></span>
                           <span></span>
                           <span></span>
                        </div>
                     </div>
                  )}
                  {!hasUserSentMessage && (
                     <div className='chat-options user-messages'>
                        <button type='button' id='button-consultant' className='chat-option text message message-right' onClick={handleConsultantClick}>Chat with consultant</button>
                        <button type='button' id='button-services' className='chat-option text message message-right' onClick={handleServicesClick}>Learn more about services</button>
                        <button type='button' id='button-support' className='chat-option text message message-right' onClick={handleSupportClick}>I'm a customer and need support</button>
                     </div>
                  )}
                  {!showConsultationMessage && !showChatServices && (
                     <form onSubmit={handleSubmit} className={`chat-input-form ${isCollapsed ? 'chat-input-form-collapsed' : ''}`}>
                        <input
                           type='text'
                           placeholder='Your answer...'
                           className='chat-input'
                           value={inputValue}
                           onChange={(e) => setInputValue(e.target.value)}
                           disabled={isInputDisabled}
                        />
                        <button type='submit' className='send-button' disabled={isInputDisabled}>
                           <Image src='../../images/icons/arrow-send.svg' alt='Send' width={24} height={24} />
                        </button>
                     </form>
                  )}
               </div>

               {showConsultationMessage && (
                  <div className={`chat-consultation ${isCollapsed ? 'chat-consultation-collapsed' : ''}`}>
                     <p className='consultation-text'>Click here to book your session and get the personalized help you need.</p>
                     <a href='https://dnconsult.org/book-your-call/' className='consultation-button button'>Book a consultation</a>
                  </div>
               )}

               {showChatServices && (
                  <div className='chat-services'>
                     <button type='button' className='chat-option' onClick={() => handleServiceOptionClick('Transitional Care Management')}>Transitional Care Management</button>
                     <button type='button' className='chat-option' onClick={() => handleServiceOptionClick('Relocation Support')}>Relocation Support</button>
                     <button type='button' className='chat-option' onClick={() => handleServiceOptionClick('Alzheimer\'s/Dementia Management')}>Alzheimer's/Dementia Management</button>
                  </div>
               )}
            </div>
         )}
         <button className='collapse-button' onClick={toggleChatCollapse}>
            <Image
               src={isCollapsed || !isChatVisible ? '/images/icons/chat-icon.svg' : '/images/icons/arrow-down.svg'}
               alt='Collapse'
               width={24}
               height={24}
            />
         </button>
      </>
   )
}

export default Chat