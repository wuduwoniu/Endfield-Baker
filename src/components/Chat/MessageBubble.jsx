import MarkdownContent from './MarkdownContent'
import { useCharacter } from '../CharacterContext'

const BAKER = '/baker-assets'

export default function MessageBubble({ message, isStreaming }) {
  const isUser = message.role === 'user'
  const { character } = useCharacter()
  const isRight = isUser

  const rootAlign = isRight ? 'flex-end' : 'flex-start'
  const rowJustify = isRight ? 'flex-end' : 'flex-start'
  const bubbleMargin = isRight ? { marginRight: '76px' } : { marginLeft: '76px' }
  const avatarPos = isRight
    ? { right: '-21px', top: '-21px' }
    : { left: '-21px', top: '-21px' }
  const bubbleRadius = isRight ? '16px 0 16px 16px' : '0 16px 16px 16px'
  const bubbleBg = isRight
    ? {
        backgroundColor: 'rgb(243, 242, 242)',
        color: 'black',
        backgroundImage: 'linear-gradient(rgb(239, 237, 237) 1px, transparent 1px), linear-gradient(90deg, rgb(239, 237, 237) 1px, transparent 1px)',
        backgroundSize: '4px 4px',
      }
    : {
        backgroundColor: 'rgb(69, 69, 69)',
        color: 'white',
      }
  const tailFill = isRight ? 'rgb(243, 242, 242)' : 'rgb(69, 69, 69)'
  const tailSide = isRight ? 'right' : 'left'
  const tailPath = isRight ? 'M0,0 L9,0 Q0,0 0,20 Z' : 'M9,0 L0,0 Q9,0 9,20 Z'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 0,
      width: '100%', maxWidth: '100%', alignItems: rootAlign,
    }}>
      {/* Row with avatar + bubble */}
      <div style={{
        position: 'relative', width: '100%', minWidth: 0,
        display: 'flex', justifyContent: rowJustify,
      }}>
        {/* Framed avatar — absolute */}
        <div style={{
          position: 'absolute', width: '98px', height: '98px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'visible', ...avatarPos,
        }}>
          <img
            src={`${BAKER}/ui/avatarframe.png`}
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'contain', pointerEvents: 'none', userSelect: 'none',
              opacity: 0.9, transform: 'translateY(-3px)',
            }}
          />
          <div style={{
            position: 'relative', zIndex: 1, backgroundColor: 'rgb(75, 85, 99)',
            border: '1px solid rgba(255,255,255,0.75)',
            borderRadius: '50%', overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            width: '56px', height: '56px',
          }}>
            <img
              src={isRight ? `${BAKER}/avatars/endministrator.png` : character.avatar}
              alt={isRight ? '终端管理员' : character.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Bubble wrap — tail and body are siblings */}
        <div style={{
          position: 'relative', marginTop: '4px',
          display: 'inline-block', maxWidth: '60%', minWidth: 0,
          ...bubbleMargin,
        }}>
          {/* SVG tail — sibling of bubble body */}
          <div style={{
            position: 'absolute', top: 0, [tailSide]: '-8px',
            width: '9px', height: '20px', overflow: 'hidden',
          }}>
            <svg viewBox="0 0 9 20" width="100%" height="100%" preserveAspectRatio="none">
              <path d={tailPath} fill={tailFill} />
            </svg>
          </div>

          {/* Bubble body */}
          <div style={{
            position: 'relative', padding: '8px 12px', fontSize: '16px',
            fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            overflowWrap: 'anywhere', wordBreak: 'break-word',
            whiteSpace: 'pre-wrap', lineHeight: 1.6, textAlign: 'left',
            borderRadius: bubbleRadius,
            ...bubbleBg,
          }}>
            {isRight ? (
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{message.content}</p>
            ) : (
              <>
                <MarkdownContent content={message.content} />
                {isStreaming && !message.content && (
                  <span style={{ display: 'inline-block', width: '8px', height: '16px', backgroundColor: '#6b6b80', borderRadius: '2px' }} className="animate-pulse" />
                )}
                {isStreaming && message.content && (
                  <span style={{ display: 'inline-block', width: '4px', height: '16px', backgroundColor: '#4f6bff', marginLeft: '2px', borderRadius: '2px' }} className="animate-pulse" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
