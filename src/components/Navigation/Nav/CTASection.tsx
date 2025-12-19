import { CMSLink } from '@/components/Link'
import type { Header as HeaderType } from '@/payload-types'

type CTASectionProps = {
    cta: HeaderType['cta']
}

export const CTASection: React.FC<CTASectionProps> = ({ cta }) => {

    if (!cta) return null

    return (
        <div className='space-y-4 lg:space-y-0 lg:space-x-4 flex flex-col lg:flex-row lg:items-center'>
            {cta.map(({ link }, i) => (
                <CMSLink
                    key={i}
                    {...link}
                    className="font-medium relative z-10"
                />
            ))}
        </div>
    )

}