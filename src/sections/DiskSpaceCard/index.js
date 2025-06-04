import { Card, Alert, Button, Link } from '@newfold/ui-component-library';
import { ProgressBar } from "@newfold/ui-component-library";
import getDiskSpaceText from './getDiskSpaceText';

const DiskSpaceCard = ( { diskSpace = {}, methods } ) => {
    let {
        diskused: diskUsed = '0',
        disklimit: diskLimit = '0',
    } = diskSpace || {};

    diskUsed = parseFloat( diskUsed.match(/[\d.]+/)[0]);

    diskLimit = parseFloat( diskLimit.match(/[\d.]+/)[0]);

    let spaceAvailable = diskLimit  - diskUsed ;

    const text = getDiskSpaceText( spaceAvailable );

    const usagePercentage = (diskUsed / diskLimit) * 100;
    const progressBarLevel = usagePercentage < 60 ? 'high-capacity' : usagePercentage < 95 ? 'medium-capacity' : 'low-capacity';

    return (
        <Card
            className={`nfd-disk-space-card nfd-min-h-[208px] nfd-p-6 nfd-border nfd-border-gray-200 nfd-rounded-lg ${diskSpace ? 'nfd-disk-space-available' : 'nfd-disk-space-not-available'}`}
            data-usage-percentage={usagePercentage}
        >
            <div className="nfd-flex nfd-justify-between nfd-items-center">
                <h3 className="nfd-text-lg nfd-font-medium">{ text.title }</h3>
                {diskSpace && (
                    <p className="nfd-text-base nfd-font-normal nfd-disk-space-used">{diskUsed} / {diskLimit} GB</p>
                )}
            </div>
            {diskSpace ? (
                <>
                    <div className={`nfd-flex nfd-items-center nfd-gap-2 nfd-mt-7 nfd-disk-space-level ${progressBarLevel}`} >
                        <ProgressBar
                            max={100}
                            min={0}
                            progress={usagePercentage}
                        />
                    </div>
                    <div className="nfd-flex nfd-items-center nfd-gap-2 nfd-mt-7" >
                        <Alert className="box-alert" variant={usagePercentage < 60 ? 'success' : usagePercentage < 95 ? 'warning' : 'error' }>
                            {usagePercentage < 60 ? text.highCapacity : usagePercentage < 95 ? text.mediumCapacity : text.lowCapacity }
                        </Alert>
                    </div>
                    <a className="nfd-text-right nfd-change-plan">{text.button}</a>
                </>
            ) : (
                <p className="nfd-text-sm nfd-text-gray-500">{text.noInfoAvailable}</p>
            )}
        </Card>
    );
};

export default DiskSpaceCard;
