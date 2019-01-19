using UnityEngine;
using Vuforia;
using UnityEngine.Video;

/// <summary>
///     A custom handler that implements the ITrackableEventHandler interface.
/// </summary>
public class VideoHandler : MonoBehaviour, ITrackableEventHandler
{
    #region PRIVATE_MEMBER_VARIABLES

    protected TrackableBehaviour mTrackableBehaviour;
    public GameObject VideoPlayerGO;
    private VideoPlayer videoPlayer;

    #endregion // PRIVATE_MEMBER_VARIABLES

    #region UNTIY_MONOBEHAVIOUR_METHODS

    protected virtual void Start()
    {
        videoPlayer = VideoPlayerGO.GetComponent<VideoPlayer>();
        mTrackableBehaviour = GetComponent<TrackableBehaviour>();
        if (mTrackableBehaviour)
            mTrackableBehaviour.RegisterTrackableEventHandler(this);
    }

    #endregion // UNTIY_MONOBEHAVIOUR_METHODS

    #region PUBLIC_METHODS

    /// <summary>
    ///     Implementation of the ITrackableEventHandler function called when the
    ///     tracking state changes.
    /// </summary>
    public void OnTrackableStateChanged(
        TrackableBehaviour.Status previousStatus,
        TrackableBehaviour.Status newStatus)
    {
        if (newStatus == TrackableBehaviour.Status.DETECTED ||
            newStatus == TrackableBehaviour.Status.TRACKED ||
            newStatus == TrackableBehaviour.Status.EXTENDED_TRACKED)
        {
            Debug.Log("Hello " + mTrackableBehaviour.TrackableName + " found");
            OnTrackingFound(mTrackableBehaviour.TrackableName);
        }
        else if (previousStatus == TrackableBehaviour.Status.TRACKED &&
                 newStatus == TrackableBehaviour.Status.NO_POSE)
        {
            Debug.Log("Bye " + mTrackableBehaviour.TrackableName + " lost");
            OnTrackingLost();
        }
        else
        {
            // For combo of previousStatus=UNKNOWN + newStatus=UNKNOWN|NOT_FOUND
            // Vuforia is starting, but tracking has not been lost or found yet
            // Call OnTrackingLost() to hide the augmentations
            OnTrackingLost();
        }
    }

    #endregion // PUBLIC_METHODS

    #region PRIVATE_METHODS

    protected virtual void OnTrackingFound(string imageName)
    {
        var videoComponents = GetComponentsInChildren<VideoPlayer>(true);

        // Enable rendering:
        foreach (var component in videoComponents) {
            component.url = Application.persistentDataPath + "/videos/" + imageName;
            component.Play();
        }
    }


    protected virtual void OnTrackingLost()
    {
        // clear all known trackables
        var tracker = TrackerManager.Instance.GetTracker<ObjectTracker>();
        foreach (TargetFinder target in tracker.GetTargetFinders())
        {
            target.ClearTrackables(false);
        }

        var videoComponents = GetComponentsInChildren<VideoPlayer>(true);

        // Disable rendering:
        foreach (var component in videoComponents)
            component.Stop();
    }


    private void PlayVideo(string fileName)
    {
        videoPlayer.url = Application.persistentDataPath + "/videos/" + fileName;
        videoPlayer.Play();
    }

    #endregion // PRIVATE_METHODS
}
