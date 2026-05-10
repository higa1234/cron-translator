import { Stack } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { CronExamples } from './components/CronExamples'
import { CronFieldForm } from './components/CronFieldForm'
import { CronResultView } from './components/CronResultView'
import { cronExpressionFieldOrder, defaultCronFields } from './constants'
import { translateCron } from './lib/translateCron'
import type { CronFieldKey, CronFields } from './types/cron'

export function CronTranslator() {
  const [cronFields, setCronFields] =
    useState<CronFields>(defaultCronFields)
  const [isCronExpressionCopied, setIsCronExpressionCopied] = useState(false)
  const copiedMessageTimeoutId = useRef<number | undefined>(undefined)
  const cronExpression = cronExpressionFieldOrder
    .map((key) => cronFields[key])
    .join(' ')
  const result = useMemo(
    () => translateCron(cronExpression),
    [cronExpression],
  )

  useEffect(() => {
    return () => {
      if (copiedMessageTimeoutId.current !== undefined) {
        window.clearTimeout(copiedMessageTimeoutId.current)
      }
    }
  }, [])

  function updateCronField(key: CronFieldKey, value: string) {
    setCronFields((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function updateCronFields(fields: CronFields) {
    setCronFields(fields)
  }

  async function copyCronExpression() {
    await navigator.clipboard.writeText(cronExpression)
    setIsCronExpressionCopied(true)

    if (copiedMessageTimeoutId.current !== undefined) {
      window.clearTimeout(copiedMessageTimeoutId.current)
    }

    copiedMessageTimeoutId.current = window.setTimeout(() => {
      setIsCronExpressionCopied(false)
      copiedMessageTimeoutId.current = undefined
    }, 2200)
  }

  return (
    <Stack gap={8}>
      <CronFieldForm
        fields={cronFields}
        cronExpression={cronExpression}
        isCronExpressionCopied={isCronExpressionCopied}
        onFieldChange={updateCronField}
        onCronExpressionPaste={updateCronFields}
        onCopyCronExpression={copyCronExpression}
      />
      <CronResultView result={result} />
      <CronExamples />
    </Stack>
  )
}
