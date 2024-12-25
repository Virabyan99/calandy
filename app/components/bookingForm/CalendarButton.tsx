import { Button } from '@/components/ui/button'
import { useButton, type AriaButtonProps } from '@react-aria/button'
import { CalendarState } from '@react-stately/calendar'
import { mergeProps } from '@react-aria/utils'
import { useFocusRing } from '@react-aria/focus'
import { useRef } from 'react'

const CalendarButton = (
  props: AriaButtonProps<'button'> & {
    state?: CalendarState
    side?: 'left' | 'right'
  }
) => {
  const ref = useRef(null)
  const { buttonProps } = useButton(props, ref)
  const { focusProps } = useFocusRing()
  return (
    <Button
      className="outline"
      size="icon"
      ref={ref}
      disabled={props.isDisabled}
      {...mergeProps(buttonProps, focusProps)}>
      {props.children}
    </Button>
  )
}

export default CalendarButton
