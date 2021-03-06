import React, { Fragment } from "react";
import _ from "lodash";
import styled from "styled-components";

const Chart = styled.pre`
  font-family: "Source Code Pro";
  text-align: center;
`;

const Finger = styled.span`
  font-weight: bold;
`;

const Label = styled.span``;

const Wire = styled.span``;

const Fingering = styled.span``;

const getMinAndMax = chord =>
  _.chain(chord)
    .map(string => (_.isArray(string) ? string[0] : string))
    .reject(_.isNull)
    .thru(frets => ({
      min: _.min(frets),
      max: _.max(frets)
    }))
    .value();

export default ({ chord, name }) => {
  let { min, max } = getMinAndMax(chord);

  const buildFretRange = () => _.range(min, Math.max(max + 1, min + 5));

  const buildFretRows = frets =>
    _.map(frets, fret =>
      _.chain(_.range(chord.length))
        .map(
          string =>
            (_.isArray(chord[string]) ? chord[string][0] : chord[string]) ==
            fret ? (
              <Finger>{fret == 0 ? "○" : "●"}</Finger>
            ) : (
              <Wire>{fret == 0 ? "┬" : "│"}</Wire>
            )
        )
        .value()
    );

  const intersperseFretWire = rows =>
    _.flatMap(rows, row => [
      row,
      <Wire>{`├${_.repeat("┼", chord.length - 2)}┤`}</Wire>
    ]);

  const appendFingering = rows => [
    ...rows,
    <Fingering>
      {_.chain(chord)
        .map(fret => (_.isArray(fret) ? fret[1] : " "))
        .value()}
    </Fingering>
  ];

  const attachLeftGutter = rows =>
    _.map(rows, (row, i) => (
      <Fragment>
        <Label>
          {"  "}
          {i == 0 && min != 0 ? _.pad(min, 2) : "  "}
        </Label>
        {row}
      </Fragment>
    ));

  const attachRightGutter = rows =>
    _.map(rows, (row, i) => (
      <Fragment>
        {row}
        <Label>
          {i == 0 && name
            ? ` ${name}`
            : name ? ` ${_.repeat(" ", name.length)}` : " "}
        </Label>
      </Fragment>
    ));

  const joinRows = rows =>
    _.map(rows, row => (
      <Fragment>
        {row}
        <br />
      </Fragment>
    ));

  return (
    <Chart>
      {_.chain()
        .thru(buildFretRange)
        .thru(buildFretRows)
        .thru(intersperseFretWire)
        .thru(appendFingering)
        .thru(attachLeftGutter)
        .thru(attachRightGutter)
        .thru(joinRows)
        .value()}
    </Chart>
  );
};
