import React from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { insightsPanelSelector } from 'uiSrc/slices/panels/insights'
import DatabaseSidePanels from 'uiSrc/components/database-side-panels'

import styles from './styles.module.scss'

export interface Props {
  children: React.ReactNode
  panelClassName?: string
}

const ExplorePanelTemplate = (props: Props) => {
  const { children, panelClassName } = props
  const { isOpen: isInsightsOpen } = useSelector(insightsPanelSelector)

  return (
    <div className={cx(styles.mainWrapper)}>
      <div className={cx(styles.mainPanel, { [styles.insightsOpen]: isInsightsOpen })}>
        {children}
      </div>
      <DatabaseSidePanels panelClassName={panelClassName} />
    </div>
  )
}

export default React.memo(ExplorePanelTemplate)