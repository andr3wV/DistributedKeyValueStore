module.exports = {
    downDetectionDelete : async function(failures) {
    failures.forEach(function(failure) {
        if (view[failure] !== undefined) {
            const failureIndex = view[failure]
            const viewIp = Object.keys(view);
            for (let i = failureIndex; i < viewIp.length; i++) {
                view[viewIp[i]] += -1;
            }
            vectorClock.splice(failureIndex, 1);
            delete view[failure];
            delete shards[failure]
            broadcastViewDelete(Object.keys(view), failure, failures)
                .then((response) => {
                    return Promise.resolve();
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }
    });
}
}