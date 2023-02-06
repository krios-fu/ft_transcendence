import { Injectable } from "@nestjs/common";
import {
    IGameData,
    IInputData
} from "./elements/Game";
import { sortedIndexBy } from "lodash";

@Injectable()
export class    GameReconciliationService {

    /*
    **  Maximum time Reconciliator will go into the past to reconcile inputs.
    **
    **  IMPORTANT: Must be less than point transition timeout.
    */
    static readonly timeLimit: number = 500;

    reconcile(input: IInputData[], inputBuffer: IInputData[],
                lastServerUpdate: number): [number, number] {
        let dropIndex: number = -1; // Index of last old input to drop
        let firstInsertionIndex: number = -1;
        let insertionIndex: number;

        for (let i: number = 0; i < input.length; ++i)
        {
            /*
            **  Idea to improve efficiency: Use an array to store insertion
            **  indexes in order to benefit from grouped insertions when
            **  insertion indexes are equal. And then, firstInsertionIndex
            **  variable would be unnecessary.
            */
            if (input[i].when < lastServerUpdate)
            {
                dropIndex = i;
                if (lastServerUpdate - input[i].when
                        > GameReconciliationService.timeLimit)
                    return ([undefined, undefined]);
                insertionIndex = sortedIndexBy(inputBuffer, input[i], (elem) => {
                    return (elem.when);
                });
                inputBuffer.splice(insertionIndex, 0, {...input[i]});
                if (firstInsertionIndex === -1)
                    firstInsertionIndex = insertionIndex;
            }
            else // No more inputs to reconcile, because input is sorted.
                break ;
        }
        /*
        **  Increase dropIndex so that it signals the first valid index
        **  to the function caller.
        */
        if (dropIndex != -1)
            ++dropIndex;
        return ([firstInsertionIndex, dropIndex]);
    }

    getAffectedSnapshots(input: IInputData,
                            snapshotBuffer: IGameData[]): IGameData[] {
        let snapshotIndex: number;

        snapshotIndex = sortedIndexBy(snapshotBuffer, {
            when: input.when
        } as IGameData, (snapshot) => {
            return (snapshot.when);
        });
        if (snapshotBuffer[snapshotIndex].when != input.when)
            --snapshotIndex;
        if (snapshotIndex <= 0)
            return ([]);
        /*
        **  Select previous snapshot to take as a starting point
        **  for the reconstruction.
        */
        --snapshotIndex;
        //Array of object references
        return (snapshotBuffer.slice(snapshotIndex));
    }

    getAffectedInputs(snapshot: IGameData,
                        inputBuffer: IInputData[]): IInputData[] {
        let targetIndex: number;

        if(!snapshot)
            return ([]);
        targetIndex = sortedIndexBy(inputBuffer, {
            when: snapshot.when
        } as IInputData, (input) => {
            return (input.when);
        });
        //Array of object references
        return (inputBuffer.slice(targetIndex));
    }

}
