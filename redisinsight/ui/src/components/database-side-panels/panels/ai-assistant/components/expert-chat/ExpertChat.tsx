import React, { Ref, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EuiButtonEmpty, EuiText, EuiToolTip } from '@elastic/eui'
import { useParams } from 'react-router-dom'
import {
  aiExpertChatSelector,
  askExpertChatbot,
  clearExpertChatHistory,
} from 'uiSrc/slices/panels/aiAssistant'
import { scrollIntoView } from 'uiSrc/utils'
import { connectedInstanceSelector } from 'uiSrc/slices/instances/instances'

import ChatHistory from '../chat-history'
import ChatForm from '../chat-form'
import { ExpertEmptyHistoryText } from '../empty-history/texts'

import styles from './styles.module.scss'

const ExpertChat = () => {
  const { messages } = useSelector(aiExpertChatSelector)
  const { name: connectedInstanceName, modules } = useSelector(connectedInstanceSelector)
  const [isLoading, setIsLoading] = useState(false)

  const scrollDivRef: Ref<HTMLDivElement> = useRef(null)
  const { instanceId } = useParams<{ instanceId: string }>()

  const dispatch = useDispatch()

  useEffect(() => {
    scrollToBottom('auto')
  }, [])

  const handleSubmit = useCallback((message: string) => {
    scrollToBottom('smooth')
    setIsLoading(true)
    dispatch(askExpertChatbot(
      instanceId,
      message,
      () => {
        setIsLoading(false)
        scrollToBottom('smooth')
      },
      () => setIsLoading(false)
    ))
  }, [instanceId])

  const onClearSession = () => {
    dispatch(clearExpertChatHistory())
  }

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      scrollIntoView(scrollDivRef?.current, {
        behavior,
        block: 'start',
        inline: 'start',
      })
    }, 0)
  }

  return (
    <div className={styles.wrapper} data-testid="ai-document-chat">
      <div className={styles.header}>
        {instanceId ? (
          <EuiToolTip
            content={connectedInstanceName}
            anchorClassName={styles.dbName}
          >
            <EuiText size="xs" className="truncateText">db: {connectedInstanceName}</EuiText>
          </EuiToolTip>
        ) : (<span />)}
        <EuiButtonEmpty
          disabled={!messages?.length}
          iconType="eraser"
          size="xs"
          onClick={onClearSession}
          className={styles.startSessionBtn}
        >
          Clear
        </EuiButtonEmpty>
      </div>
      <div className={styles.chatHistory}>
        <ChatHistory
          modules={modules}
          welcomeText={ExpertEmptyHistoryText}
          isLoadingAnswer={isLoading}
          history={messages}
          scrollDivRef={scrollDivRef}
          onSubmit={handleSubmit}
        />
      </div>
      <div className={styles.chatForm}>
        <ChatForm
          isDisabled={!instanceId || isLoading}
          validationMessage={!instanceId ? 'Open a database' : undefined}
          placeholder="Type / for specialized expertise"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default ExpertChat