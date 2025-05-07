import { Card, Alert, Button, Link } from '@newfold/ui-component-library';
import { ProgressBar } from "@newfold/ui-component-library";
import getDiskSpaceText from './getDiskSpaceText';

const DiskSpaceCard = ( { diskSpace = {}, methods } ) => {
    const {
        diskused: diskUsed,
        disklimit: diskLimit,
    } = diskSpace;


    let spaceAvailable = 4.65; //TODO set dynamic value.

    const text = getDiskSpaceText( spaceAvailable );

    const usagePercentage = (diskUsed / diskLimit) * 100;
    const progressBarLevel = usagePercentage < 60 ? 'high-capacity' : usagePercentage < 95 ? 'medium-capacity' : 'low-capacity';

    return (
        <Card
            className="nfd-disk-space-card nfd-min-h-[208px] nfd-p-6 nfd-border nfd-border-gray-200 nfd-rounded-lg"
        >
            <div className="nfd-flex nfd-justify-between nfd-items-center">
                <h3 className="nfd-text-lg nfd-font-medium">{ text.title }</h3>
                <p className="nfd-text-base nfd-font-normal">{ diskUsed } / {diskLimit} GB</p>
            </div>
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
        </Card>
    );
};

export default DiskSpaceCard;
