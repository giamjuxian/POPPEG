using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Vuforia;

public class SimpleCloudHandler : MonoBehaviour, ICloudRecoEventHandler {
    public ImageTargetBehaviour ImageTargetTemplate;
    private CloudRecoBehaviour mCloudRecoBehaviour;
	private bool mIsScanning = false;
	private string mTargetMetadata = "";

    // Use this for initialization
    void Start () {
    	// register this event handler at the cloud reco behaviour
    	mCloudRecoBehaviour = GetComponent<CloudRecoBehaviour>();
	 
	    if (mCloudRecoBehaviour)
	    {
	    mCloudRecoBehaviour.RegisterEventHandler(this);
	    }
	}

    public void OnInitialized(TargetFinder targetFinder) {
	    Debug.Log ("Cloud Reco initialized");
	}
	public void OnInitError(TargetFinder.InitState initError) {
	    Debug.Log ("Cloud Reco init error " + initError.ToString());
	}
	public void OnUpdateError(TargetFinder.UpdateState updateError) {
	    Debug.Log ("Cloud Reco update error " + updateError.ToString());
    }

    public void OnStateChanged(bool scanning)
    {
        Debug.Log("STATE CHANGED : " + scanning);
        mIsScanning = scanning;
        if (scanning)
        {
            // clear all known trackables
            var tracker = TrackerManager.Instance.GetTracker<ObjectTracker>();
            foreach(TargetFinder target in tracker.GetTargetFinders()) 
            {
                target.ClearTrackables(false);
            }
        }
    }

    // Here we handle a cloud target recognition event
    public void OnNewSearchResult(TargetFinder.TargetSearchResult targetSearchResult)
    {
        Debug.Log("NEW SEARCH RESULT");
        TargetFinder.CloudRecoSearchResult cloudRecoSearchResult =
            (TargetFinder.CloudRecoSearchResult)targetSearchResult;

        // do something with the target metadata
        mTargetMetadata = cloudRecoSearchResult.MetaData;

        // stop the target finder (i.e. stop scanning the cloud)
        // mCloudRecoBehaviour.CloudRecoEnabled = false;

        // Build augmentation based on target
        if (ImageTargetTemplate)
        {
            // enable the new result with the same ImageTargetBehaviour:
            var tracker = TrackerManager.Instance.GetTracker<ObjectTracker>();
            foreach (TargetFinder target in tracker.GetTargetFinders())
            {
                ImageTargetBehaviour imageTargetBehaviour =
                (ImageTargetBehaviour)target.EnableTracking(targetSearchResult, ImageTargetTemplate.gameObject);
            }
        }
    }

}

