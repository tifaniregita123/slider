import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { InvitationNotFoundPage } from '@components/Pages'
import { AnimatePresence, motion } from 'framer-motion'
import { MailOpenIcon } from '@heroicons/react/outline'
import { AudioPlayer } from '@components/Player/AudioPlayer'
import { useBasicFetcher } from '@hooks/useFetcher'
import { useInvitationData } from '@hooks/useInvitationData'
import { CountdownSection } from './Sections/CountdownSection'
import { GuestBookSection } from './Sections/GuestBookSection'
import { HeroSection } from './Sections/HeroSection'

import { Animate } from '@components/Animations/AOS'
import type { FeatureGuest } from 'invitation'
import type { TemplateProps } from '..'
import { AkadSection } from './Sections/AkadSection'
import { BrideSection } from './Sections/BrideSection'
import { DonationSection } from './Sections/DonationSection'
import { GallerySection } from './Sections/GallerySection'
import { LiveStreamingSection } from './Sections/LiveStreamingSection'
import { LoveStorySection } from './Sections/LoveStorySection'
import { ResepsiSection } from './Sections/ResepsiSection'
import { ThanksSection } from './Sections/ThanksSection'

export const BrownFloral: React.FC<TemplateProps> = ({ invitation, invitation_uid }) => {
  // return nothing if there's no template
  if (!invitation) {
    return <InvitationNotFoundPage />
  }
  const router = useRouter()
  const [invitationOpened, setInvitationOpened] = useState<boolean>(true)

  const { data: userInvitation } = useBasicFetcher<FeatureGuest>(
    router?.query?.invite?.toString() ? `/features/guest/${invitation_uid}/${router?.query?.invite?.toString()}` : null
  )
  const { envelopes, featureLimits, invitationMusic, musicSettings } = useInvitationData(invitation)

  useEffect(() => {
    if (typeof featureLimits?.open_popup === 'boolean') {
      setInvitationOpened(featureLimits?.open_popup)
    }
  }, [featureLimits])

  const overlayVariants = {
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        duration: 0.3,
        delayChildren: 0.4
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        duration: 0.3,
        delay: 0.4
      }
    }
  }

  return (
    <>
      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body,p,span {
              font-family: 'louis', sans-serif !important;
            }
            
            h1 {
              font-family: 'belgan', serif !important;
              color: white;
            }
            h2 {
              font-family: 'montserrat', sans-serif !important;
            }
            `
          }}
        />
      </Head>

      <main tw="overflow-x-hidden overflow-y-hidden">
        {invitationMusic && <AudioPlayer url={invitationMusic} settings={musicSettings} />}
        <div>
          <HeroSection data={invitation} />
          <div tw="bg-[#F5EBDF]">
            <BrideSection data={invitation} />
            <CountdownSection data={invitation} />
            <div tw="md:flex md:w-full md:justify-between text-[#5F5F5F] md:pb-10">
              <AkadSection data={invitation} />
              <ResepsiSection data={invitation} />
            </div>
            {featureLimits?.media?.gallery && <LiveStreamingSection data={invitation} />}
            {featureLimits?.media?.gallery && <LoveStorySection data={invitation} />}
            {featureLimits?.guest_book && <GuestBookSection data={invitation} />}
            {envelopes?.attributes?.active && <DonationSection data={invitation} />}
            {featureLimits?.media?.gallery && <GallerySection data={invitation} />}
            <ThanksSection data={invitation} />
          </div>
        </div>
      </main>
      <AnimatePresence>
        {!invitationOpened && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            className="fixed top-0 left-0 w-full h-screen">
            <motion.div initial={{ y: 0 }} animate={{ y: 0 }} exit={{ y: '-100vh' }} transition={{ duration: 1 }}>
              <div
                tw="flex items-center justify-center w-full h-screen bg-transparent bg-cover bg-no-repeat bg-center relative bg-blend-darken bg-black bg-opacity-50"
                style={{ backgroundImage: "url('/static/images/BG.png')" }}>
                <div
                  tw="relative z-50 flex flex-col w-full items-center text-white px-5 py-8 space-y-1 text-center rounded-lg"
                  {...Animate.AOS({ type: 'fade-in' })}>
                  <h1 tw="text-6xl items-center flex lg:text-9xl">
                    {invitation?.brides_data?.female_nickname} &amp; {invitation?.brides_data?.male_nickname}
                  </h1>

                  <div tw="flex flex-col space-y-2">
                    {userInvitation && (
                      <div tw="flex flex-col text-center">
                        <h2 tw=" text-xl lg:text-4xl" {...Animate.AOS({ type: 'fade-up', delay: 550 })}>
                          Kepada
                        </h2>
                        <h1 tw="py-2 md:py-5 text-3xl" {...Animate.AOS({ type: 'fade-up', delay: 600 })}>
                          {userInvitation?.name}
                        </h1>
                      </div>
                    )}
                    <div>
                      <button
                        tw="flex space-x-2 justify-items-center rounded-lg border-2 border-white py-1 px-3 mx-auto"
                        onClick={() => setInvitationOpened(false)}>
                        <MailOpenIcon tw="w-5 h-5 text-white" />
                        <h2 tw="text-sm lg:text-xl">Buka Undangan</h2>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
