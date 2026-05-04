import { useCharacter } from '../CharacterContext'

const BAKER = '/baker-assets'

export default function WelcomeScreen() {
  const { character } = useCharacter()

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
        <img
          src={`${BAKER}/backgrounds/deco_sns_chat_bg.png`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Industrial geometric decorations */}
      <img
        src={`${BAKER}/decorations/deco_sns_tweet_decorate_10.png`}
        alt=""
        className="absolute top-[15%] left-[10%] w-16 h-16 object-contain opacity-[0.12] pointer-events-none"
      />
      <img
        src={`${BAKER}/decorations/deco_sns_tweet_decorate_20.png`}
        alt=""
        className="absolute top-[20%] right-[12%] w-12 h-12 object-contain opacity-[0.10] pointer-events-none"
      />
      <img
        src={`${BAKER}/decorations/deco_sns_tweet_decorate_30.png`}
        alt=""
        className="absolute bottom-[25%] left-[15%] w-14 h-14 object-contain opacity-[0.08] pointer-events-none"
      />
      <img
        src={`${BAKER}/decorations/deco_sns_tweet_decorate_40.png`}
        alt=""
        className="absolute bottom-[20%] right-[10%] w-10 h-10 object-contain opacity-[0.10] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Avatar with Baker frame and square mask */}
        <div className="relative">
          <img
            src={`${BAKER}/masks/icon_round_char_square_mask.png`}
            alt=""
            className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] object-contain opacity-50 pointer-events-none"
          />
          <img
            src={`${BAKER}/ui/avatarframe.png`}
            alt=""
            className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] object-contain opacity-80"
          />
          <img
            src={character.avatar}
            alt={character.name}
            className="relative w-[88px] h-[88px] rounded-full object-cover shadow-lg"
          />
        </div>

        <div className="text-center">
          <h1 className="text-xl font-semibold text-label-primary">{character.name}</h1>
          <p className="text-sm text-label-secondary mt-1">{character.description}</p>
        </div>

        {/* Bottom decorative line */}
        <div className="flex items-center gap-2 opacity-40">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-label-tertiary" />
          <img
            src={`${BAKER}/decorations/bg_sns_tweet_decorate_line.png`}
            alt=""
            className="h-2 object-contain opacity-60"
          />
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-label-tertiary" />
        </div>
      </div>
    </div>
  )
}
