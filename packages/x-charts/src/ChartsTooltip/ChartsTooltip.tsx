import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { Popper } from '@mui/base/Popper';
import { NoSsr } from '@mui/base/NoSsr';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import { generateVirtualElement, useMouseTracker, getTootipHasData, TriggerOptions } from './utils';
import {
  CartesianChartSeriesType,
  ChartSeriesDefaultized,
  ChartSeriesType,
} from '../models/seriesType/config';
import { ChartsItemContentProps, ChartsItemTooltipContent } from './ChartsItemTooltipContent';
import { ChartsAxisContentProps, ChartsAxisTooltipContent } from './ChartsAxisTooltipContent';
import { ChartsTooltipClasses, getTooltipUtilityClass } from './tooltipClasses';
import { SVGContext } from '../context/DrawingProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { SeriesContext } from '../context/SeriesContextProvider';

export type ChartsTooltipProps = {
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger?: TriggerOptions;
  /**
   * Component to override the tooltip content when triger is set to 'item'.
   */
  itemContent?: React.ElementType<ChartsItemContentProps<any>>;
  /**
   * Component to override the tooltip content when triger is set to 'axis'.
   */
  axisContent?: React.ElementType<ChartsAxisContentProps>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
};

const useUtilityClasses = (ownerState: { classes: ChartsTooltipProps['classes'] }) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    markCell: ['markCell'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell'],
  };

  return composeClasses(slots, getTooltipUtilityClass, classes);
};

function ChartsTooltip(props: ChartsTooltipProps) {
  const { trigger = 'axis', itemContent, axisContent } = props;
  const svgRef = React.useContext(SVGContext);

  const mousePosition = useMouseTracker();

  const { item, axis } = React.useContext(InteractionContext);

  const displayedData = trigger === 'item' ? item : axis;

  const tooltipHasData = getTootipHasData(trigger, displayedData);
  const popperOpen = mousePosition !== null && tooltipHasData;

  const classes = useUtilityClasses({ classes: props.classes });
  const axisData = displayedData as AxisInteractionData;

  const isXaxis = (axisData?.x && axisData.x.index) !== undefined;

  const { xAxisIds, yAxisIds } = React.useContext(CartesianContext);
  const series = React.useContext(SeriesContext);

  const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];

  const dataIndex = isXaxis ? axisData.x && axisData.x.index : axisData?.y && axisData.y.index;
  const axisValue = isXaxis ? axisData.x && axisData.x.value : axisData?.y && axisData.y.value;

  const relevantSeries = React.useMemo(() => {
    const rep: any[] = [];
    (
      Object.keys(series).filter((seriesType) =>
        ['bar', 'line', 'scatter'].includes(seriesType),
      ) as CartesianChartSeriesType[]
    ).forEach((seriesType) => {
      series[seriesType]!.seriesOrder.forEach((seriesId) => {
        const item = series[seriesType]!.series[seriesId];
        const axisKey = isXaxis ? item.xAxisKey : item.yAxisKey;
        if (axisKey === undefined || axisKey === USED_AXIS_ID) {
          rep.push(series[seriesType]!.series[seriesId]);
        }
      });
    });
    return rep;
  }, [USED_AXIS_ID, isXaxis, series]);

  const itemData = displayedData as ItemInteractionData<ChartSeriesType>;
  const seriesItem = React.useContext(SeriesContext)[itemData?.type]?.series[
    itemData.seriesId
  ] as any;

  React.useEffect(() => {
    const click = () => {
      console.log('clicked');
      if (trigger === 'item') {
        if (itemData == null || itemData.dataIndex === undefined) {
          return null;
        }
        const formattedValue = seriesItem.valueFormatter(seriesItem.data[itemData.dataIndex]);
        const values =
          seriesItem.type === 'pie'
            ? {
                color: seriesItem.data[itemData.dataIndex].color,
                displayedLabel: seriesItem.data[itemData.dataIndex].label,
              }
            : {
                color: seriesItem.color,
                displayedLabel: seriesItem.label,
              };
        console.log(values);
        console.log(displayedData);
        console.log('formattedValue ', formattedValue);
      } else {
        console.log(trigger);

        console.log(axisValue);
        console.log(relevantSeries);
        const value = relevantSeries.map(
          ({ color, id, label, valueFormatter, data }: ChartSeriesDefaultized<any>) => ({
            color,
            label,
            value: valueFormatter(data[dataIndex]),
          }),
        );
        console.log(value);
      }
    };
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    element.addEventListener('mousedown', click);
    return () => {
      element.removeEventListener('mousedown', click);
    };
  }, [svgRef, dataIndex, itemData, trigger, axisValue, relevantSeries, seriesItem]);
  if (trigger === 'none') {
    return null;
  }
  return (
    <NoSsr>
      {popperOpen && (
        <Popper
          open={popperOpen}
          placement="right-start"
          anchorEl={generateVirtualElement(mousePosition)}
          style={{ pointerEvents: 'none' }}
        >
          {trigger === 'item' ? (
            <ChartsItemTooltipContent
              itemData={displayedData as ItemInteractionData<ChartSeriesType>}
              content={itemContent}
              sx={{ mx: 2 }}
              classes={classes}
            />
          ) : (
            <ChartsAxisTooltipContent
              axisData={displayedData as AxisInteractionData}
              content={axisContent}
              sx={{ mx: 2 }}
              classes={classes}
            />
          )}
        </Popper>
      )}
    </NoSsr>
  );
}

ChartsTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Component to override the tooltip content when triger is set to 'axis'.
   */
  axisContent: PropTypes.elementType,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Component to override the tooltip content when triger is set to 'item'.
   */
  itemContent: PropTypes.elementType,
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger: PropTypes.oneOf(['axis', 'item', 'none']),
} as any;

export { ChartsTooltip };
